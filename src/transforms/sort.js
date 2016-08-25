const {identity, unwrap} = require('../utils')
const {empty} = require('../retake')

function reduce(fn, init) {
    return (list) => list.reduce(fn, init)
}

const initialize = (acc, node, next) => next({pivot: node, lte: empty(), gt: empty()})

const partition = comparer => (acc, node, next) => {
    let {pivot,lte,gt} = acc
    if(comparer(unwrap(node), unwrap(pivot))) lte = lte.prepend(node)
    else gt = gt.prepend(node)
    return next({pivot,lte,gt})
}

const getMerge = (comparer) => (acc) => {
    if(!acc || !acc.hasOwnProperty('pivot')) return empty()
    const leftSorted = reduce(sort(comparer)())(acc.lte)
    const rightSorted = reduce(sort(comparer)())(acc.gt)
    return rightSorted.prepend(acc.pivot).prependCollection(leftSorted)
}

const getSelector = comparer => (function* selector() {
    yield initialize
    while(true) yield partition(comparer) //eslint-disable-line
})()

function sort(comparer) {
    const merge = getMerge(comparer)
    const selector = getSelector(comparer)
    return (reducer = identity) => (acc, node, next) => {
        return next ? selector.next().value(acc, node, next) :
            reducer === identity ? reducer(merge(acc)) : reduce(reducer)(merge(acc))
    }
}

module.exports = sort