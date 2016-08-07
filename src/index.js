const {List} = require('./list/list')
const {prototypeUtils: {extendPrototypeWith}} = require('./utils')

const operations = require('./list/operations')
const toZipper = require('./zipper/zipper')

extendPrototypeWith(List.prototype, operations, toZipper)

const retake = require('./list/factory')
const zipperActions = require('./zipper/action-templates')
const transforms = require('./list/transducers/transforms')

module.exports = {retake, transforms, zipperActions}