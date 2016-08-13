let assert = require('assert'), retake = require('../src/retake')
const empty = retake.empty, eq = assert.strictEqual, neq = assert.notStrictEqual
const str = JSON.stringify
const arrEq = (...arrs) => {
  let [first, ...rest] = arrs, t = str(first);
  return rest.every(v => t === str(v))
}

describe('Empty List', function() {
    describe('principles', function() {
        it('should identify itself as empty', function(){
            eq(empty.done, true)
        })
        it('should iterate (0 times)', function(){
            let counter = 0
            for(let i of empty) { counter++ }
            eq(counter, 0)
        })
        it('should contain an element of undefined value', function(){
            eq(empty.first, void(0))
        })
        it('should have an empty tail', function(){
            eq(empty.tail, empty)
        })
    })
});

describe('List', function() {
    describe('principles', function() {
        it('should evaluate first element when constructed', function() {
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
            let i = 0, gen = function*() { while(true) yield ++i; }
            let r = retake.fromValue(i, gen)
            eq(r.first, 0)
            eq(r.first, i)
        })
        it('should not mutate itself (be immutable)', function() {
            let r = retake.from([1,2,3]), r2 = r.tail, r3= r.prepend(9)
            neq(r, r2)
            neq(r, r3)
        })
        it('should not be ephermal (be implicitly persistent)', function() {
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
        it('should return the same value for an arbitrary number of tail calls (be idempotent)', function() {
            let r = retake.of(1,2,3)
            eq(r.tail.first, r.tail.first)
            eq(r.tail.tail.first, r.tail.tail.first)
        })
        it('should not repull an element from source (memoize next)', function() {
            let pulled = false, gen = function*() { while(!pulled) { pulled=true; yield 'a'; yield 'b'; } }
            let r = retake.from(gen)
            assert.ok(arrEq([...r], [...r]))
        })
    })
    describe('construction', function() {
        it('should return list provided first element of any type', function() {
            let dummy = null, primitive = true, obj = {}
            let r = retake.fromValue(dummy)
            eq(r.first, dummy)
            r = retake.fromValue(primitive)
            eq(r.first, primitive)
            r = retake.fromValue(obj)
            eq(r.first, obj)
        })
        it('should return list provided first element and an iterable', function() {
            let i = 0, gen = function*() { yield ++i }
            let r = retake.fromValue(i, gen)
            eq(r.first, 0)
            eq(r.first, i)
            eq(r.tail.first, i)
            neq(r.first, i)
        })
        it('should return list provided an iterable', function() {
            let naturalsGen = function*(n=0) { while(true) yield ++n; }
            let naturalsIterable = {
                [Symbol.iterator]: (n=0) => ({ next: () => ({value: ++n}) })
            }
            let r = retake.from(naturalsGen), r2 = retake.from(naturalsIterable)
            eq(r.first, r2.first)
            eq(r.tail.first, r2.tail.first)
            eq(r.tail.tail.first, r2.tail.tail.first)
        })
        it('should return list provided an iterator', function() {
            let naturalsGen = function*(n=0) { while(true) yield ++n; }
            let naturalsIterable = {
                [Symbol.iterator]: (n=0) => ({ next: () => ({value: ++n}) })
            }
            let r = retake.fromIterator(naturalsGen())
            let r2 = retake.fromIterator(naturalsIterable[Symbol.iterator]())
            eq(r.first, r2.first)
            eq(r.tail.first, r2.tail.first)
            eq(r.tail.tail.first, r2.tail.tail.first)
        })
        it('should be able to return list given indefinite number of values', function() {
            let naturals = (limit) => (function*(n=0) { while(n<limit) yield ++n; })()
            let r1 = retake.of(...naturals(1))
            let r3 = retake.of(...naturals(3)), r5 = retake.of(...naturals(5))
            eq(r1.first, 1)
            eq(r1.tail.done, true)
            eq(r3.first, 1)
            eq(r3.tail.tail.first, 3)
            eq(r3.tail.tail.tail.done, true)
            eq(r5.first, 1)
            eq(r5.tail.tail.tail.tail.first, 5)
            eq(r5.tail.tail.tail.tail.tail.done, true)
        })
        it('should return list provided a sequence generating function', function() {
            let multiples = (base) => (n=0) => n+base
            let r = retake.seq(multiples(5))
            eq(r.first, 5)
            eq(r.tail.first, 10)
            eq(r.tail.tail.first, 15)
        })
        it('should be able to return list in reverse order for a finite sequence', function() {
            let naturals5 = function*(n=0) { while(n<5) yield ++n; }
            let r = retake.fromReversed(naturals5)
            eq(r.first, 5)
            eq(r.tail.first, 4)
            eq(r.tail.tail.tail.tail.first, 1)
            eq(r.tail.tail.tail.tail.tail.done, true)
        })
    })
});
