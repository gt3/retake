let assert = require('assert'), retake = require('../src/retake')
const empty = retake.empty, eq = assert.strictEqual, neq = assert.notStrictEqual

describe('Empty List', function() {
    describe('principles', function() {
        it('should identify itself as empty', function(){
            eq(empty.done, true)
        })
        it('should iterate zero times', function(){
            let counter = 0
            for(let i of empty) { counter++ }
            eq(counter, 0)
        })
        it('should have one element with an undefined value', function(){
            eq(empty.first, void(0))
        })
        it('should have an empty tail', function(){
            eq(empty.tail, empty)
        })
    })
});

describe('List', function() {
    describe('principles', function() {
        it('should evaluate first element', function() {
            let n=0, naturals = () => ++n
            let r = retake.seq(naturals)
            neq(n, 0)
        })
        it('should provide sequential access', function() {
            let naturals = (n=0) => n+1
            let r = retake.seq(naturals)
            eq(r.first, 1)
            eq(r.tail.first, 2)
            eq(r.tail.tail.first, 3)
        })
        it('should not evaluate eagerly (be lazy)', function() {
            let i = 0, gen = function*() { yield i++ }
            let r = retake.fromValue(i, gen)
            eq(r.first, i)
        })
        it('should not mutate itself (be immutable)', function() {
            let r = retake.from([1,2,3]), r2 = r.tail, r3= r.prepend(9)
            neq(r, r2)
            neq(r, r3)
        })
        it('should not be ephermal (be invisbly persistent)', function() {
            let i; naturals = (n=0) => (i = n+1)
            let r = retake.seq(naturals)
            eq(r.first,1)
            eq(r.tail.first,2)
            eq(i,2)
            let r2 = r.prepend(-1)
            eq(r2.first,-1)
            eq(r2.tail.first,1)
            eq(i,2)
        })
    })
});
