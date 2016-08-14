let assert = require('assert')
let {eq, neq, oeq, oneq, random} = require('./helpers')
let {identity} = require('../src/utils')
let retake = require('../src'), empty = retake.empty

describe('Zipper', function() {
    describe('no side effects', function() {
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
            oneq([...z3.list], arr)
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
    describe('operations', function() {
        let r, z, arr
        before(function() {
            arr = [1,2,3,4,5,6,7,8,9]
            r = retake.from(arr), z = r.toZipper()
        })
        it('should unzip (down)', function() {
            let z1 = z.unzip().unzip(), z3 = z1.unzip(3).unzip(3)
            eq(z1.focus, 2)
            eq(z3.focus, 8)
            oeq([...z3], [6,7,8])
        })
        it('should zip (up)', function() {
            let z1 = z.unzip().unzip(), z3 = z1.unzip(3).unzip(3)
            let z4 = z1.zip(), z5 = z3.zip(3)
            eq(z1.focus, 2)
            eq(z3.focus, 8)
            eq(z4.focus, 1)
            eq(z5.focus, 5)
            oeq([...z5], [3,4,5])
        })
        it('should update focus', function() {
            let z2 = z.unzip(), value = random()*10000
            eq(z2.focus, arr[0])
            let z3 = z2.update(value)
            eq(z3.focus, value)
            oeq([...z3.list].slice(2), arr.slice(2))
        })
        it('should update more than one matching elements in focus list', function() {
            let z2 = z.unzip(4)
            let pred = v => v % 2 == 0, i = 0, newValues = v => ++i && v*1000
            let z3 = z2.updateWhen(pred, newValues)
            eq(i, 2)
            eq(z3.focus, newValues(z2.focus))
            oeq([...z3.list].slice(4), arr.slice(4))
            eq(z2.focus, 4)
        })
        it('should remove focus', function() {
            let z2 = z.unzip()
            eq(z2.focus, arr[0])
            let z3 = z2.remove()
            eq(z3.focus, undefined)
            oeq([...z3.list], arr.slice(1))
        })
        it('should remove more than one matching elements in focus list', function() {
            let z2 = z.unzip(4), pred = v => v % 2 == 0
            let z3 = z2.removeWhen(pred)
            eq(z2.focus, 4)
            eq(z2.size(), 4)
            eq(z3.size(), 2)
            eq(z3.focus, 3)
            oeq([...z3.list].slice(2), arr.slice(4))
        })
    })
});