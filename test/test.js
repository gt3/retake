const retake = require('../src')
const {Reducers: {prepend, append, counter}, Transformers: {sort,map,filter,take,skip,takeUntil,flatten}, Splitters: {splitAt}} = retake.transforms
let r = retake.of(1,2,3,4,5,6,7,8,9)
console.log('-----')
for(let i of r) {  console.log('%j',i); }
console.log('-----')
r = r.skip(2).take(5).reverse().sort()
for(let i of r) {  console.log('%j',i); }

console.log('-----')
r = r.reduce(take(3)(prepend))
for(let i of r) {  console.log('%j',i); }
console.log('-----')
let z = r.toZipper().unzip(3).zip(2).unzip(3)
console.log('-----')
console.log(z.focus)
console.log('-----')
r = r.append(8,9)
for(let i of r) {  console.log('%j',i); }

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