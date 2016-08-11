const {identity} = require('../utils')
const Zipper = require('../zipper')
const {Reducers: {prepend, append, counter},
    Transformers: {map, filter, take, skip, takeUntil, flatten, sort},
    Splitters: {splitWhen, splitAt}} = require('./index')

const toExtension = (fn, reducer = append, init) =>
    function (...args) { return this.reduce(fn(...args)(reducer), init) }

const reducerExtension = (fn, init) => function () { return this.reduce(fn, init) }

module.exports = {
    map: toExtension(map),
    filter: toExtension(filter),
    take: toExtension(take),
    skip: toExtension(skip),
    takeUntil: toExtension(takeUntil),
    flatten: toExtension(flatten),
    sort: toExtension(sort, identity),
    splitWhen: toExtension(splitWhen),
    splitAt: toExtension(splitAt),
    reverse: reducerExtension(prepend),
    size: reducerExtension(counter, 0),
    toZipper: Zipper.create
}