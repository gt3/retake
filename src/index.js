const {Factory, List} = require('./list/factory')
const {prototypeUtils: {extend}} = require('./utils')
const extensions = require('./list/extensions')
extend(List, ...extensions)

const zipperActions = require('./zipper/action-templates')
const transforms = require('./list/transforms')

module.exports = {retake: Factory, transforms, zipperActions}