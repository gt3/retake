const List = require('./list/list')
const {prototypeUtils: {extend}} = require('./utils')
const extensions = require('./list/extensions')
extend(List, ...extensions)

const retake = require('./list/factory')
const zipperActions = require('./zipper/action-templates')
const transforms = require('./list/transforms')

module.exports = {retake, transforms, zipperActions}