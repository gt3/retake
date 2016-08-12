const Utils = require('./utils')
const {identity, wrap, unwrap, memoize0} = Utils
const {pullNext, pullReversed, linkIterables, sequenceYielder} = Utils.iteratorUtils
const {extend} = Utils.prototypeUtils
let empty

function List(head = wrap(), getNext = () => empty) {
    Object.assign(this, { head, getNext })
}

function getEnumerator(rawOut) {
    const extractValue = rawOut ? identity : unwrap
    return function* enumerate(acc, node, next) {
        if (next) {
            yield extractValue(node)
            yield* next(acc)
        }
    }
}

List.prototype = {
    get done() { return !!this.head.sentinel },
    get lazy() { return true },
    get first() { return this.done ? void (0) : unwrap(this.head) },
    get tail() { return this.getNext() },
    reduce(fn, acc = empty) {
        if (this.done) return fn.call(this, acc)
        return fn.call(this, acc, this.head, (acc) => this.tail.reduce(fn, acc))
    },
    iterateInReverse(rawOut) { return pullReversed(this.reduce(getEnumerator(rawOut))) },
    [Symbol.iterator](rawOut) { return this.reduce(getEnumerator(rawOut)) },
    append(...values) { return this.appendCollection(values) },
    appendCollection(iterable) { return Factory.from(this, iterable) },
    prepend(...values) { return this.prependCollection(values) },
    prependCollection(iterable) { return Factory.from(iterable, this) },
    prependInReverse(iterable) { return Factory.fromReversed(iterable, this) },
    makeSiblingOf(...values) { return Factory.of(this, ...values) }
}

empty = new class extends List {
    get done() { return true }
    next() { return this }
    [Symbol.iterator]() { return this }
}

const next = (value, iterator) => 
    () => Factory.fromIterator(iterator, empty, pullNext(unwrap(value)))

class Factory {
    static seq(seqFn) {
        return Factory.fromIterator(sequenceYielder(seqFn))
    }
    static of(...values) {
        return Factory.from(values)
    }
    static from(...iterables) {
        const iterator = linkIterables(...iterables)
        return Factory.fromIterator(iterator)
    }
    static fromReversed(target, base=empty) {
        const reversedTarget = (iterable) => pullReversed(linkIterables(iterable))
        const iterator = linkIterables(...[reversedTarget(target), base])
        return Factory.fromIterator(iterator, base)
    }
    static fromIterator(iterator, base=empty, pullFn=pullNext()) {
        const pulled = pullFn(iterator)
        return !pulled || pulled.done ? base : Factory.fromValue(pulled.value, iterator, identity)
    }
    static fromValue(value, iterable=empty, toIterator=linkIterables) {
        const node = wrap(value), iterator = toIterator(iterable)
        return new List(node, memoize0(next(value, iterator)))
    }
    static extend(...extensions) { extend(List, ...extensions) }
}
Factory.empty = empty

module.exports = Factory