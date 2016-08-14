let assert = require('assert')
let {eq, neq, oeq, oneq} = require('./helpers')
let {identity} = require('../src/utils')
let retake = require('../src'), empty = retake.empty

describe('Zipper', function() {
    describe.skip('principles', function() {
        it('should evaluate source on demand (be lazy)', function() {
        })
        it('should not modify itself, instead create new versions to support updates (be immutable)', function() {
        })
        it('should provide paused computation to manage state efficiently', function() {
        })
        it('should be able to represent complete source', function() {
        })
    })
    describe.skip('toZipper', function() {
    })
});