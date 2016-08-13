let assert = require('assert')
let {eq, neq, oeq, oneq} = require('./helpers')
let {identity} = require('../src/utils')
let retake = require('../src'), empty = retake.empty
const {Reducers: {prepend, append, counter}, Transformers: {sort,map,filter,take,skip,takeUntil,flatten}, Splitters: {splitAt,splitWhen}} = retake.transforms

describe('Transforms', function() {
    describe('map', function() {
        let r, incrSeq, arr
        before(function() {
            incrSeq = (s=1) => (x) => x + s++
            arr = [1,2,3]
            r = retake.from(arr)
        })
        it('as extension method', function() {
            oeq([...r.map(incrSeq())], [...arr.map(incrSeq())])
        })
        it('as transforming reducer', function() {
            oeq([...r.reduce(map(incrSeq())(append))], [...arr.map(incrSeq())])
            oeq([...r.reduce(map(incrSeq())(prepend))], [...arr.map(incrSeq()).reverse()])
        })
    })
    describe('filter', function() {
        let r, invoke, arr, t = () => true, f = () => false
        before(function() {
            //also tests if context is set correctly from callee (reduce)
            invoke = Function.prototype.call.bind(Function.prototype.call)
            arr = [t, f, t]
            r = retake.from(arr)
        })
        it('as extension method', function() {
            oeq([...r.filter(invoke)], arr.filter(invoke))
        })
        it('as transforming reducer', function() {
            oeq([...r.reduce(filter(invoke)(append))], arr.filter(invoke))
        })
    })
    describe('take', function() {
        let r, arr
        before(function() {
            arr = [1,2,3,4,5]
            r = retake.from(arr)
        })
        it('as extension method', function() {
            oeq([...r.take(3)], [1,2,3])
        })
        it('as transforming reducer', function() {
            oeq([...r.reduce(take(3)(append))], [1,2,3])
            oeq([...r.reduce(take(3)(prepend))], [1,2,3].reverse())
        })
    })
    describe('skip', function() {
        let r, arr
        before(function() {
            arr = [-1,0,1,2,3]
            r = retake.from(arr)
        })
        it('as extension method', function() {
            oeq([...r.skip(2)], [1,2,3])
        })
        it('as transforming reducer', function() {
            oeq([...r.reduce(skip(2)(append))], [1,2,3])
            oeq([...r.reduce(skip(2)(prepend))], [1,2,3].reverse())
        })
    })
    describe('takeUntil', function() {
        let r, invoke, arr, t = () => true, f = () => false, exp
        before(function() {
            //also tests if context is set correctly from callee (reduce)
            invoke = Function.prototype.call.bind(Function.prototype.call)
            arr = [f, f, f, t, f, f]
            r = retake.from(arr)
            function* tu(arr, pred) {
                for(let v of arr) {
                    if(pred(v)) break;
                    yield v
                }
            }
            exp = [...tu(arr, invoke)]
        })
        it('as extension method', function() {
            oeq([...r.takeUntil(invoke)], exp)
        })
        it('as transforming reducer', function() {
            oeq([...r.reduce(takeUntil(invoke)(append))], exp)
        })
    })
    describe('flatten', function() {
        let r, arr
        before(function() {
            arr = [1, [2, 3], 4, [[5,6, [7, 8]]], [9]]
            r = retake.from(arr)
        })
        it('as extension method', function() {
            oeq([...r.flatten()], [1, 2, 3, 4, [5, 6, [7, 8]], 9])
            oeq([...r.flatten(2)], [1, 2, 3, 4, 5, 6, [7, 8], 9])
            oeq([...r.flatten(99)], [1, 2, 3, 4, 5, 6, 7, 8, 9])
        })
        it('as transforming reducer', function() {
            oeq([...r.reduce(flatten()(append))], [1, 2, 3, 4, [5,6, [7, 8]], 9])
            oeq([...r.reduce(flatten(2)(append))], [1, 2, 3, 4, 5, 6, [7, 8], 9])
            oeq([...r.reduce(flatten(99)(append))], [1, 2, 3, 4, 5, 6, 7, 8, 9])
            oeq([...r.reduce(flatten(99)(prepend))], [1, 2, 3, 4, 5, 6, 7, 8, 9].reverse())
        })
    })
    describe('sort', function() {
        let r, r2, r3, r4, r5, arr, arr2, arr3, exp
        before(function() {
            arr = [8,4,5,7,1,9], arr2 = ['phelps','ledecky','laactee','adrianne','martin','bales']
            exp = arr2.sort()
            r = retake.from(arr)
            r2 = retake.from(arr2)
            r3 = retake.from(arr2.map(v => ({key: v})))
            r4 = retake.from(arr2.map(v => ({keyyy: v})))
            arr3 = [5, 1, [2, 999], 4]
            r5 = retake.from(arr3)
        })
        it('as extension method', function() {
            oeq([...r.sort()], arr.sort())
            oeq([...r.sort(null, false)], arr.sort().reverse())
            oeq([...r2.sort()], exp)
            oeq([...r3.sort().map(v => v.key)], exp)
            oeq([...r4.sort('keyyy').map(v => v.keyyy)], exp)
            //console.log(...r5.sort(),  arr3.sort())
            oeq([...r5.sort()], arr3.sort())
        })
        it('as transforming reducer', function() {

        })
    })
});