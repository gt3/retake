let assert = require('assert')
let {eq, neq, oeq, oneq, random} = require('./helpers')
let {identity} = require('../src/utils')
let retake = require('../src'), empty = retake.empty

describe('Zipper', function() {
    describe('boundaries', function() {
        let r, z, arr
        before(function() {
            arr = [1,2,3,4,5,6,7,8,9]
            r = retake.from(arr), z = r.toZipper()
        })
        it('should preserve integrity of source list on traversal', function() {
            let f = z.focus, sz = z.size(), z2sz = z.unzip().unzip().zip().size()
            eq(sz, 0)
            eq(z2sz, 1)
            eq(z.focus, f)
        })
        it('should preserve integrity of source list on updates', function() {
            let z2 = z.unzip(3).unzip(2).zip(3).unzip(2), value = random()*10000
            let z3 = z2.update(value)
            eq(z3.focus, value)
            neq([...z3.list], arr)
            oeq([...z.list], arr)
        })
        it('should preserve laziness of source list', function() {
            let i = 1, gen = function*() { while(true) yield ++i; }
            let r = retake.fromValue(i, gen), z = r.toZipper().unzip()
            eq(z.focus, i-1)
            let z2 = z.unzip(3)
            eq(z2.focus, i-1)
        })
    })
});