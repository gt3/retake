const List = require('./list/list')
const {prototypeUtils: {extend}} = require('./utils')

const operations = require('./list/operations')
const toZipper = require('./zipper/zipper')

extend(List, operations, toZipper)

const retake = require('./list/factory')
const zipperActions = require('./zipper/action-templates')
const transforms = require('./list/transducers/transforms')

module.exports = {retake, transforms, zipperActions}