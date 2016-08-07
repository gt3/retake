const {wrap, unwrap, iteratorUtils: {getIterator}} = require('../../utils')

function flatten(levels) {
    return (reducer = Reducers.append) => (acc, node, next) => {
        if(!next) return reducer(acc)
        function flattenLevels(iterator, n) {
            let value, done
            while(({value, done} = iterator.next()) && !done) {
                const iteratorInner = getIterator(unwrap(value))
                if(iteratorInner && --n > 0) flattenLevels(iteratorInner, n)
                else reducer(acc, value, (newacc) => (acc = newacc))
            }
            return acc
        }
        const iterator = getIterator(unwrap(node))
        return levels>0 && iterator ? next(flattenLevels(iterator, levels)) : reducer(acc, node, next)
    }
}

module.exports = flatten