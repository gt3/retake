const retake = require('./retake')
const transformExtensions = require('./transforms/extensions')
retake.extend(transformExtensions)

const transforms = require('./transforms')
const zipperActions = require('./zipper/action-templates')

module.exports = Object.assign(retake,{transforms},{zipperActions})