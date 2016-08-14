let assert = require('assert')
let {wrap, unwrap} = require('../src/utils')
let retake = require('../src/retake'), empty = retake.empty
let {eq, neq, oeq, oneq} = require('./helpers')

describe('Empty List', function() {
    describe('principles', function() {
        it('should identify itself as empty', function() {
            assert.ok(empty.done)
        })
        it('should iterate (0 times)', function() {
            let counter = 0
            for(let i of empty) { counter++ }
            eq(counter, 0)
            eq(empty.size(), 0)
        })
        it('should return undefined value for head', function() {
            eq(empty.first, void(0))
        })
        it('should have an empty tail', function() {
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
        it('should evaluate source on demand (be lazy)', function() {
            let i = 0, gen = function*() { while(true) yield ++i; }
            let r = retake.fromValue(i, gen)
            eq(r.first, 0)
            eq(r.first, i)
        })
        it('should not modify itself, instead create new versions to support updates (be immutable)', function() {
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
            oeq([...r], [...r])
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
        it('should be able to return list given arbitrary number of values', function() {
            let naturals = (limit) => (function*(n=0) { while(n<limit) yield ++n; })()
            let r0 = retake.of(), r1 = retake.of(...naturals(1))
            let r3 = retake.of(...naturals(3)), r5 = retake.of(...naturals(5))
            assert.ok(r0.done)
            eq(r1.first, 1)
            assert.ok(r1.tail.done)
            eq(r3.first, 1)
            eq(r3.tail.tail.first, 3)
            assert.ok(r3.tail.tail.tail.done)
            eq(r5.first, 1)
            eq(r5.tail.tail.tail.tail.first, 5)
            assert.ok(r5.tail.tail.tail.tail.tail.done)
        })
        it('should return list provided a continuation', function() {
            let multiples = (base) => (n=0) => n+base
            let r = retake.seq(multiples(5))
            eq(r.first, 5)
            eq(r.tail.first, 10)
            eq(r.tail.tail.first, 15)
        })
        it('should be able to return list in reverse order for a finite sequence', function() {
            let naturals = (limit) => (function*(n=0) { while(n<limit) yield ++n; })()
            let r = retake.fromReversed(naturals(5))
            eq(r.first, 5)
            eq(r.tail.first, 4)
            eq(r.tail.tail.tail.tail.first, 1)
            eq(r.tail.tail.tail.tail.tail.done, true)
        })
    })
    describe('primary operations', function() {
        it('should identify itself as lazy (type helper)', function() {
            let e = retake.of(), r2 = retake.of(1)
            assert.ok(e.lazy)
            assert.ok(r2.lazy)
        })
        it('should be iterable (per protocol spec)', function() {
            let arr = [1,2,3], r = retake.from(arr), e = retake.from([],[])
            oeq([...r], arr)
            oeq([...e], [])
        })
        it('should be able to iterate in reverse order', function() {
            let arr = [1,2,3], r = retake.from(arr), e = retake.from([],[])
            oeq([...r.iterateInReverse()], arr.reverse())
            oeq([...e.iterateInReverse()], [])
        })
        it('should be able to return nodes in raw format', function() {
            let arr = [1,2,3], r = retake.from(arr), rawOut = true;
            const raw = [...r[Symbol.iterator](rawOut)], rawRev = [...r.iterateInReverse(rawOut)]
            oneq(raw, arr)
            oeq(raw, [...arr.map(wrap)])
            oeq(rawRev, [...arr.reverse().map(wrap)])
        })
        it('should call reducing function to reduce itself', function() {
            let r = retake.of(1,2,3), add = (acc, node, next) => next ? next(acc+unwrap(node)) : acc
            let sum = r.reduce(add, 0)
            eq(sum, 6)
        })
        it('should prepend arbitrary number of elements', function() {
            let arr = [1,2,3], r = retake.from(arr), r0 = r.prepend()
            let r2 = r.prepend(0), r3 = r.prepend(-1,0)
            let r4 = empty.prepend(0), r5 = empty.prepend(1,2)
            eq(r0.first, r.first)
            oeq([...r2],[0, ...arr])
            oeq([...r3],[-1, 0, ...arr])
            oeq([...r4], [0])
            oeq([...r5], [1,2])
        })
        it('should prepend a collection of elements', function() {
            let arr = [1,2,3], arr2 = [-1, 0], r = retake.from(arr)
            let r0 = r.prependCollection([]), r2 = r.prependCollection(arr2)
            let r3 = empty.prependCollection([]), r4 = empty.prependCollection(arr)
            eq(r0.first, r.first)
            oeq([...r2],[...arr2, ...arr])
            oeq(r3, empty)
            oeq([...r4], [...arr])
        })
        it('should prepend a collection of elements in reverse order', function() {
            let arr = [1,2,3], arr2 = [-1, 0], r = retake.from(arr)
            let r0 = r.prependInReverse([]), r2 = r.prependInReverse(arr2)
            let r3 = empty.prependInReverse([]), r4 = empty.prependInReverse(arr)
            eq(r0.first, r.first)
            oeq([...r2],[...arr2.reverse(), ...arr])
            oeq(r3, empty)
            oeq([...r4], [...arr.reverse()])
        })
        it('should append arbitrary number of elements', function() {
            let arr = [1,2,3], r = retake.from(arr), r0 = r.append()
            let r2 = r.append(4), r3 = r.append(5, 6)
            let r4 = empty.append(0), r5 = empty.append(1,2)
            eq(r0.first, r.first)
            oeq([...r2],[...arr, 4])
            oeq([...r3],[...arr, 5, 6])
            oeq([...r4], [0])
            oeq([...r5], [1,2])
        })
        it('should append a collection of elements', function() {
            let arr = [1,2,3], arr2 = [4, 5], r = retake.from(arr)
            let r0 = r.appendCollection([]), r2 = r.appendCollection(arr2)
            let r3 = empty.appendCollection([]), r4 = empty.appendCollection(arr)
            eq(r0.first, r.first)
            oeq([...r2],[...arr, ...arr2])
            oeq(r3, empty)
            oeq([...r4], [...arr])
        })
        it('should prepend itself as a sibling to another collection', function() {
            let arr = [1,2,3], arr2 = [4, 5]
            let r1 = retake.from(arr), r2 = retake.from(arr2)
            let r3 = r1.makeSiblingOf(r2), r4 = r1.makeSiblingOf(empty)
            let r5 = empty.makeSiblingOf(r1)
            oeq([...r3.first], arr)
            oeq([...r3.tail.first], arr2)
            oeq([...r4.first], arr)
            oeq(r4.tail.first, empty)
            oeq(r5.first, empty)
            oeq([...r5.tail.first], [...r1])
        })
    })
    describe('extend prototype', function() {
        it('should register extension', function() {
            let arr = [1,2,3], r_untouched = retake.from(arr)
            let ext = { toArray: function() { return [...this] }, dummy: 'dummy' }
            retake.extend(ext)
            let r = retake.from(arr)
            eq(r.dummy, ext.dummy)
            oeq(r.toArray(), arr)
            neq(r_untouched.dummy, ext.dummy)
        })
    })
});