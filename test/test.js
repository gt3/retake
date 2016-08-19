const retake = require('../src'), empty = retake.empty
const {Reducers: {prepend, append, counter}, Transformers: {sort,map,filter,take,skip,takeUntil,flatten}, Splitters: {splitAt}, reduce, composeT, pipeT} = retake.transforms

//1, 11, 21, 1211, 111221, 312211, 13112221, 1113213211

function look_and_say(l, acc=empty) {
    if(l.done) return acc
    let first = l.first, count = 0
    let split = l.splitWhen(v => !(first === v && ++count))
    acc = acc.append(count, first)
    return look_and_say(split.tail.first, acc)
}
let seq = retake.seq(l => l ? look_and_say(l) : retake.of(1))
for(let e of seq.take(8)) console.log(...e)

/*console.log('-----')
for(let i of r) {  console.log('%j',i); }
console.log('-----')
let r2 = r.skip(2).take(5).reverse().sort()
for(let i of r2) {  console.log('%j',i); }

console.log('*********')
//r = r.reduce(take(3)(prepend))
//let p = compose(skip(2), take(5))(append)
//let c = cT(take(5), skip(2))
let p = pipeT(skip(2), take(5))
let r3 = reduce(p(prepend))(r)
for(let i of r3) {  console.log('%j',i); }

console.log('-----')
let t = skip(2)(take(5)(append))
let r4 = r.reduce(t)
for(let i of r4) {  console.log('%j',i); }
console.log('-----')
*/


/* console.log('Zipper ***********')
let r = l.toZipper()
r = r.unzip(3).unzip(2).zip(3).unzip(2)
console.log('size:',r.size)
console.log('-----')
for(let i of r) { console.log('%j',i); }

console.log('Zipper SET ***********')
console.log('Focus: %j',r.focus)
let z2 = r.update(999)
//console.log('Focus: %j',z2.focus)
console.log('Zipper LIST ***********')
for(let i of z2.list) { console.log('%j',i); }

console.log('Zipper REMOVE ***********')
let z3 = r.remove()
for(let i of z3.list) {  console.log('%j',i); }

console.log('Zipper UpdateWhen ***********')
const pred = v => v % 2 == 0, newValue = v => v*100 //v => Object.assign({}, v, {key: v.key.toUpperCase()})
r = l.toZipper().unzip(1).unzip(4)
for(let i of r) { console.log('%j',i); }
console.log('-----')
r = r.updateWhen(pred, newValue)
for(let i of r) { console.log('%j',i); }
console.log('*** .list ****')
for(let i of r.list) { console.log('%j',i); }

console.log('Zipper RemoveWhen ***********')

r = l.toZipper().unzip(1).unzip(4)
for(let i of r) { console.log('%j',i); }
r = r.removeWhen(pred)
console.log('-----')
for(let i of r) { console.log('%j',i); }
console.log('*** .list ****')
for(let i of r.list) { console.log('%j',i); } 

console.log('Zipper Load ***********')
r = r.load([101,102])
console.log('Focus: %j',r.focus)
console.log('*** .list ****')
for(let i of r.list) { console.log('%j',i); }*/