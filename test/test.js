const {retake, transforms} = require('../src')
const {Reducers: {prepend, append, counter}, Transformers: {sort,map,filter,take,skip,takeUntil,flatten}, Splitters: {splitAt}} = transforms
let r = retake.of(1,2,3,4,5,6)
console.log('-----')
for(let i of r) {  console.log('%j',i); }
console.log('-----')
r = r.reduce(take(3)(prepend))
for(let i of r) {  console.log('%j',i); }
console.log('-----')
let z = r.toZipper().unzip(3)
console.log('-----')
console.log(z.focus)