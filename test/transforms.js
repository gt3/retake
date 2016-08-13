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
});