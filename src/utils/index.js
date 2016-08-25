const {Node, sentinel} = require('../node')

const identity = (x) => x
const isPrimitiveType = (value) => Object(value) !== value
const isLTE = key => (x, y) => isPrimitiveType(x) ? x <= y : x[key] <= y[key]
const isGT = key => (x, y) => !isLTE(key)(x,y)
const getComparer = (sortKey, asc) => asc ? isLTE(sortKey) : isGT(sortKey)

const unwrapNode = (node) => node && node.value !== void(0) ? node.value : node
const nodeWrapper = (value = sentinel) => (value instanceof Node) ? value : new Node(value)

const memoize0 = (fn, cache=null) => () => cache || (cache = fn())

const utils = { identity, isPrimitiveType, getComparer, unwrap: unwrapNode, wrap: nodeWrapper, memoize0 }

/******** Iterator Utils *******/

const pullNext = (...args) => (iterator) => iterator.next(...args)

function* pullReversed(iterator) {
    const {done, value} = iterator.next()
    if(!done) {
        yield* pullReversed(iterator)
        yield value
    }
}

function* sequenceYielder(fn, value) {
    let res = fn(value)
    if(res !== void(0)) {
        value = yield res
        yield* sequenceYielder(fn, value)
    }
}

const toIterable = (iterable) => typeof iterable === 'function' ? iterable() : iterable
const getIterator = (iterable) => 
                        iterable && !iterable.hasOwnProperty(Symbol.iterator) &&
                            iterable[Symbol.iterator] && iterable[Symbol.iterator](iterable.lazy)
const toIterator = (iterable) => getIterator(iterable) || toIterable(iterable)

function* iteratorYielder(...iterators) {
    yield
    for(let iterator of iterators) yield* iterator
}

function warmup(yielder) {
    return function ignoreFirstYield(...iterators) {
        const handle = yielder(...iterators)
        handle.next()
        return handle
    }
}

const linkIterators = warmup(iteratorYielder)

const linkIterables = (...iterables) => linkIterators(...iterables.map(iterable => toIterator(iterable)))

const iteratorUtils = {pullNext, pullReversed, toIterator, getIterator, 
                            linkIterators, linkIterables, sequenceYielder}

/************************/

/******** Prototype Utils *******/

const readable = {writable: false}
const getOwnProps = (obj) => obj ? Object.getOwnPropertyNames(obj) : []
const writableProps = (obj) => 
        getOwnProps(obj).filter(prop => Object.getOwnPropertyDescriptor(obj, prop).writable)

function setPropsReadable(target) {
    let props = Object.assign({}, ...writableProps(target).map(p => ({[p]: readable})))
    Object.defineProperties(target, props)
    return target
}

function assign(target, extensions) {
    if(!extensions || !extensions.length) return target
    setPropsReadable(target)
    let [extension, ...rest] = extensions
    Object.assign(target, extension)
    return assign(target, rest)
}

function extend(target, ...extensions) {
    const extended = assign(Object.create(setPropsReadable(target.prototype)), extensions)
    target.prototype = Object.create(extended)
    return target
}

const prototypeUtils = { extend }

module.exports = Object.assign(utils, {iteratorUtils, prototypeUtils})