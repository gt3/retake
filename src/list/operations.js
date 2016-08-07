const Factory = require('./factory')

function append(...values) { return this.appendCollection(values) }

function appendCollection(iterable) { return Factory.from(this, iterable) }

function prepend(...values) { return this.prependCollection(values) }

function prependCollection(iterable) { return Factory.from(iterable, this) }

function prependInReverse(iterable) { return Factory.fromReversed(iterable, this) }

function makeSiblingOf(...values) { return Factory.of(this, ...values) }

module.exports = {append,appendCollection,prepend,prependCollection,prependInReverse,makeSiblingOf}