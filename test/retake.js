let assert = require('assert'), retake = require('../src/retake')
const empty = retake.empty

describe('Empty List', function() {
    describe('correctness', function() {
        it('should say done', function(){
            assert.equal(empty.done, true)
        })
        it('should iterate zero times', function(){
            let counter = 0
            for(let i of empty) { counter++ }
            assert.equal(counter, 0)
        })
        it('should have first value undefined', function(){
            assert.equal(empty.first, void(0))
        })
        it('should have an empty tail', function(){
            assert.equal(empty.tail, empty)
        })
    })
});

describe('List', function() {
    describe('correctness', function() {
        it('should return head as the first element provided', function(){
            assert.equal(empty.done, true)
        })
        it('should evaluate tail on demand (lazily)', function(){
            let counter = 0
            for(let i of empty) { counter++ }
            assert.equal(counter, 0)
        })
        it('should be persistent and immutable data structure', function(){
            assert.equal(empty.first, void(0))
        })
    })
});
