const retake = require('./retake'), transforms = require('./transforms')
const transformExtensions = require('./transforms/extensions')
const zipperExtensions = require('./list-zipper/extensions')
retake.extend(transformExtensions,zipperExtensions)

module.exports = Object.assign(retake, {transforms})