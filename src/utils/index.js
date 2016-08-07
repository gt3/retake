const {Node, sentinel} = require('../list/node')

const identity = (x) => x
const isPrimitiveType = (value) => Object(value) !== value
const isLTE = key => (x, y) => isPrimitiveType(x) ? x <= y : x[key] <= y[key]
const isGT = key => (x, y) => !isLTE(key)(x,y)
const getComparer = (sortKey, asc) => asc ? isLTE(sortKey) : isGT(sortKey)

const unwrapNode = (node) => node && node.value !== void(0) ? node.value : node
const nodeWrapper = (value = sentinel) => (value instanceof Node) ? value : new Node(value)

const utils = { identity, isPrimitiveType, getComparer, unwrap: unwrapNode, wrap: nodeWrapper }

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
const getIterator = (iterable) => iterable && !iterable.hasOwnProperty(Symbol.iterator) && iterable[Symbol.iterator] && iterable[Symbol.iterator](iterable.lazy)
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

const iteratorUtils = {pullNext, pullReversed, toIterator, getIterator, linkIterators, linkIterables, sequenceYielder}

/************************/

/******** Prototype Utils *******/

const preventOverridesDescriptors = {writable: false}
const getOwnProps = (obj) => obj ? Object.getOwnPropertyNames(obj) : []
const getOwnWritableProps = (obj) => getOwnProps(obj).filter(prop => Object.getOwnPropertyDescriptor(obj, prop).writable)

function setOwnPropDescriptors(proto, descriptors=preventOverridesDescriptors) {
    let propsWithDescriptors = Object.assign({}, ...getOwnWritableProps(proto).map(prop => ({[prop]: descriptors})))
    Object.defineProperties(proto, propsWithDescriptors)
}

function extendPrototype(proto, extensions, preventOverrides=true) {
    if(!extensions || !extensions.length) return proto
    if(preventOverrides) setOwnPropDescriptors(proto)
    let [extension, ...rest] = extensions
    Object.assign(proto, extension)
    return extendPrototype(proto, rest, preventOverrides)
}

function extendPrototypeWith(proto, ...extensions) {
    return extendPrototype(proto, extensions)
}

const prototypeUtils = { extendPrototype, extendPrototypeWith }

module.exports = Object.assign(utils, {iteratorUtils, prototypeUtils})