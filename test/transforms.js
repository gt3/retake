let assert = require('assert')
let {eq, neq, oeq, oneq} = require('./helpers')
let {identity} = require('../src/utils')
let retake = require('../src'), empty = retake.empty()
const {Reducers: {prepend, append, counter}, 
        Transformers: {sort,map,filter,take,skip,takeUntil,flatten}, 
            Splitters: {splitAt,splitWhen},
                reduce, composeT, pipeT} = retake.transforms

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
        it('identity map', function() {
            oeq([...r.map(v => v)], [...arr])
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
            oeq([...r.take(10)], arr)
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
            function* takeu(arr, pred) {
                for(let v of arr) {
                    if(pred(v)) break;
                    yield v
                }
            }
            exp = [...takeu(arr, invoke)]
        })
        it('as extension method', function() {
            oeq([...r.takeUntil(invoke)], exp)
            oeq([...r.takeUntil(x => false)], arr)
        })
        it('as transforming reducer', function() {
            oeq([...r.reduce(takeUntil(invoke)(append))], exp)
        })
    })
    describe('flatten', function() {
        let r, arr, r2
        before(function() {
            arr = [1, [2, 3], 4, [[5,6, [7, 8]]], [9]]
            r = retake.from(arr)
            r2 = retake.of(r)
        })
        it('as extension method', function() {
            oeq([...r.flatten()], [1, 2, 3, 4, [5, 6, [7, 8]], 9])
            oeq([...r.flatten(2)], [1, 2, 3, 4, 5, 6, [7, 8], 9])
            oeq([...r.flatten(99)], [1, 2, 3, 4, 5, 6, 7, 8, 9])
            oeq([...r2.flatten()], arr)
        })
        it('as transforming reducer', function() {
            oeq([...r.reduce(flatten()(append))], [1, 2, 3, 4, [5,6, [7, 8]], 9])
            oeq([...r.reduce(flatten(2)(append))], [1, 2, 3, 4, 5, 6, [7, 8], 9])
            oeq([...r.reduce(flatten(99)(append))], [1, 2, 3, 4, 5, 6, 7, 8, 9])
            oeq([...r.reduce(flatten(99)(prepend))], [1, 2, 3, 4, 5, 6, 7, 8, 9].reverse())
            oeq([...r2.reduce(flatten()(append))], arr)
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
        })
        it('as transforming reducer', function() {
            oeq([...r.reduce(sort()(append))], arr.sort())
            oeq([...r.reduce(sort()(prepend))], arr.sort().reverse())
            oeq([...r.reduce(sort(null, false)(append))], arr.sort().reverse())
            oeq([...r3.reduce(sort()(map(v => v.key)(append)))], exp)
        })
        it.skip('?maybe: sort nested array on first element (mimic array sort in:[5, 1, [2, 999], 4] out:[1,  [2, 999]...])', function() {
            oeq([...r5.sort()], arr3.sort())
        })
    })
    describe('splitters', function() {
        let r, invoke, arr, t = () => true, f = () => false, exp
        before(function() {
            //also tests if context is set correctly from callee (reduce)
            invoke = Function.prototype.call.bind(Function.prototype.call)
            arr = [f, f, f, t, f, f]
            r = retake.from(arr)
            function* takeu(arr, pred) {
                for(let v of arr) {
                    if(pred(v)) break;
                    yield v
                }
            }
            exp = [...takeu(arr, invoke)]
        })
        describe('splitWhen', function() {
            it('as extension method', function() {
                let [res1, res2] = r.splitWhen(invoke)
                oeq([...res1], [...exp])
                oeq([...res2], [t,f,f])
            })
            it('as transforming reducer', function() {
                let [res1, res2] = r.reduce(splitWhen(invoke)(append))
                oeq([...res1], [...exp])
                oeq([...res2], [t,f,f])
            })
        })
        describe('splitAt', function() {
            it('as extension method', function() {
                let [res1, res2] = r.splitAt(3)
                oeq([...res1], [...exp])
                oeq([...res2], [t,f,f])
            })
            it('as transforming reducer', function() {
                let [res1, res2] = r.reduce(splitAt(3)(append))
                oeq([...res1], [...exp])
                oeq([...res2], [t,f,f])
            })
        })
    })
    describe('reverse', function() {
        let r, arr
        before(function() {
            arr = [-1,0,1,2,3]
            r = retake.from(arr)
        })
        it('should return elements in reverse order', function() {
            oeq([...r.reverse()], arr.reverse())
        })
    })
    describe('size', function() {
        let r, r0, arr
        before(function() {
            arr = [-1,0,1,2,3]
            r = retake.from(arr), r0 = retake.from([])
        })
        it('should return size of a finite list', function() {
            eq(r.size(), arr.length)
            eq(r0.size(), 0)
        })
    })
    describe('reduce', function() {
        let r, r0, arr
        before(function() {
            arr = [1,2,3,4,5,6,7,8,9]
            r = retake.from(arr), r0 = retake.from([])
        })
        describe('reducing function', function() {
            it('should tranform list given a reducing function chained directly (w/o pipe, compose helpers)', function() {
                let r3 = reduce(skip(2)(take(5)(prepend)))(r)
                oeq([...r3], arr.slice(2, 7).reverse())
            })
        })
        describe('composeT', function() {
            it('should compose transforms and have reduce apply default reducer if not provided', function() {
                let composedT = composeT(take(5), skip(2))
                let r3 = reduce(composedT)(r)
                oeq([...r3], arr.slice(2, 7))
            })
        })
        describe('pipeT', function() {
            it('should pipe transforms and have reduce apply default reducer if not provided', function() {
                let pipedT = pipeT(skip(2), take(5))
                let r3 = reduce(pipedT)(r)
                oeq([...r3], arr.slice(2, 7))
            })
        })
    })
});