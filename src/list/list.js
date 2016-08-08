const {identity, wrap, unwrap, iteratorUtils:{pullReversed}} = require('../utils')
let empty

class List {
    constructor(head = wrap(), getNext) {
        console.log('\t\t',head && head.value,'new List <<<<')
        Object.assign(this, {head, getNext})
    }
    get done() { return !!this.head.sentinel }
    get lazy() { return true }
    get first() { return this.done ? void(0) : unwrap(this.head) }
    get tail() { return this.getNext() }
    reduce(fn, acc=empty) {
        if(this.done) return fn.call(this, acc)
        return fn.call(this, acc, this.head, (acc) => this.tail.reduce(fn, acc))
    }
    iterateInReverse(rawOut) { return pullReversed(this.reduce(List.getEnumerator(rawOut))) }
    [Symbol.iterator](rawOut) { return this.reduce(List.getEnumerator(rawOut)) }
    static getEnumerator(rawOut) {
        const extractValue = rawOut ? identity : unwrap
        return function* enumerate(acc, node, next) {
            if(next) {
                yield extractValue(node)
                yield* next(acc)
            }
        }
    }
}

empty = new class extends List {
    get done() { return true }
    next() { return this }
    [Symbol.iterator]() { return this }
}

module.exports = {List, empty}