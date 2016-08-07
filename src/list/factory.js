const Utils = require('../utils')
const {identity, wrap, unwrap} = Utils
const {pullNext, pullReversed, linkIterables, sequenceYielder} = Utils.iteratorUtils
const {List, empty} = require('./list')

const next = (value, iterator) => () => Factory.fromIterator(iterator, empty, pullNext(unwrap(value)))

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
        return new List(node, next(value, iterator))
    }
}

Factory.empty = empty

module.exports = Factory