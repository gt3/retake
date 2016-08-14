const retake = require('./retake')
const transformExtensions = require('./transforms/extensions')
const zipperExtensions = require('./zipper/extensions')
retake.extend(transformExtensions,zipperExtensions)

const transforms = require('./transforms')
const zipperActions = require('./zipper/action-templates')

module.exports = Object.assign(retake,{transforms},{zipperActions})