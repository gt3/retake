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

const preventOverridesDescriptors = {configurable:false}

function SetOwnPropDescriptors(proto, descriptors=preventOverridesDescriptors) {
    let propsWithDescriptors = Object.assign({}, ...Object.getOwnPropertyNames(proto).map(prop => ({[prop]: descriptors })))
    Object.defineProperties(proto, propsWithDescriptors)
}

function ExtendPrototype(proto, extensions, preventOverrides=true) {
    if(!extensions || !extensions.length) return proto
    if(preventOverrides) SetOwnPropDescriptors(proto)
    let [first, ...rest] = extensions
    Object.assign(proto, first)
    return ExtendPrototype(proto, rest, preventOverrides)
}

function ExtendPrototypeWith(proto, ...extensions) {
    return ExtendPrototype(proto, extensions)
}

const prototypeUtils = { ExtendPrototype, ExtendPrototypeWith }

module.exports = Object.assign(utils, {iteratorUtils, prototypeUtils})