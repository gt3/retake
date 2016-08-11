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