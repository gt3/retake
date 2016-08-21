Retake
=========================

- Persistent data structures
  - Lazy List
  - Zipper
- Transformations with Transducers
  - map, filter, take, skip, takeUntil
  - sort, flatten
  - splitWhen, splitAt


## Installation
```
npm install --save retake
```

## Usage

- Node (6 or later)

```
let retake = require('retake')
```

- Browser (gzips to ~5k)

```Javascript
// es6
<script src="./node_modules/retake/lib/retake.js"></script>

// transpiled
<script src="./node_modules/retake/lib/retake.es5.js"></script>

// minified
<script src="./node_modules/retake/lib/retake.es5.min.js"></script>

// retake...

```

- For es5 versions - use [Babel polyfill](https://babeljs.io/docs/usage/polyfill/)

```Javascript
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.13.0/polyfill.min.js">
</script>
```

## Introduction

ECMAScript, the language, lacks built-in support for advanced data structures. 
Arrays and Objects in JavaScript are highly efficient and provide a flexible API. 
However their mutative surface area does not serve well in design of concurrent systems. 
This is especially true for web apps (React, Flux, Redux et al.) where UIs can be described as a function of application state in a constant fold of events. 
Use of functional data structures is key to achieve referential transparency in such scenarios.

ES2015 has introduced game-changing features (for e.g. generator functions, lambdas, iteration protocols, proper tail calls) that improve performance and offer great flexibility in representing computations. 
As a result, we've benefited from libraries such as Immutable.js and Mori that offer an assortment of fully persistent data structures.

Retake takes a more pragmatic, refined approach in managing *pieces of data* your app cares about *at any given time*.
It is comprised of List, Zipper, and Transforms that enable proper organization of data for efficient traversal and updates. 
These functional concepts are implemented and exposed in a way to meet requirements of modern JavaScript apps. 
The end goal is to free app domain of procedural code by isolating the overhead of persistence and retrieval.

This implementation covers 3 important facets:

  - Lazy List - provides an immutable persistent collection to organize data linearly using head/tail decomposition with lazy evaluation.
  - Transforms - provide an integrated way to compose and apply algorithmic transformations to data structures.
  - List Zipper - facilitates efficient traversal and updates to encompassing linear data structure.

That's very much the gist of it! Try code examples below.

By the way, it should be clear that list-based structures are primarily purposed for sequential access unlike Vectors that are index-based.

Helpful readings:
- [Persistent Data Structure](https://en.wikipedia.org/wiki/Persistent_data_structure)
- [Transducers](http://clojure.org/reference/transducers) by Rich Hickey
- [Zipper](https://en.wikipedia.org/wiki/Zipper_(data_structure)) by Gérard Huet


## Code Examples

### 1. Retake worry-free

Let's create 3 pages worth of sample data.
```Javascript
let pages = { 'p1': ['a','b'], 'p2': ['c','d'], 'p3': ['e','f'] }
```

App starts with some local data already available.
```Javascript
function* local() { yield* pages.p2 }
let p2 = retake.from(local)
console.log(...p2) // c*, d*
```

Retrieves remote data for previous and next pages.
```Javascript
function* remote_prev() { yield* pages.p1 }
let p1p2 = p2.prependCollection(remote_prev)
console.log(...p1p2) // a*, b*, c, d

function* remote_next() { yield* pages.p3 }
let p1p2p3 = p1p2.appendCollection(remote_next)
console.log(...p1p2p3.take(5)) // a, b, c, d, e*
```

This code may seem trivial but it reveals 3 important concepts:
- *Non-destructive updates* keep the original structure in tact (p2, p1p2 retain original values).
- *Structural sharing* limits allocation of memory to new data (nodes marked with *).
- *Lazy evaluation* defers allocation of memory for new data (" f " is not realized).

These are few basic principles of persistent immutable data structures. I hope the example was informative. 
Next, we'll apply smart transformations to a collection of values.

### 2. Optimized Transformations

```Javascript
let list = retake.of('react','om','angular','backbone','ember','meteor','vue','derby')
```
Let's transform this list.

a) Compose transforms directly
```Javascript
let t = filter(v => v.indexOf('r') > -1)(sort()(skip(1)(append)))
```

b) Use helper to compose transforms
```Javascript
let t = pipeT(filter(v => v.indexOf('r') > -1), sort(), skip(1))
// or
let t = composeT(skip(1), sort(), filter(v => v.indexOf('r') > -1))
```

Finally reduce over the list passing in the transducing function.
```Javascript
let result = reduce(t)(list)
console.log(...result) // derby ember meteor react

```

Chaining on objects...
```Javascript
//might be tempting
let result = list.filter(v => v.indexOf('r') > -1).sort().skip(1)
console.log(...result) // derby ember meteor react

// _not_ recommended, read more on transducers to understand why
```


### 3. Immutable values to power your app

**Look-and-say numbers** - 
watch this [video](https://youtu.be/ea7lJkEhytA?list=PLt5AfwLFPxWIL8XA1npoNAHseS-j1y-7V) by John Conway for an introduction to this sequence.

Let's first implement a function that produces the "look and say" (next element in sequence).

a) Using Transforms on List
```Javascript
function look_and_say(l, acc=empty) {
    if(l.done) return acc
    let focus = l.first, count = 0
    let split = l.splitWhen(v => !(focus === v && ++count))
    acc = acc.append(count, focus)
    return look_and_say(split.tail.first, acc)
}
```

b) Using Zipper Transforms on List
```Javascript
function look_and_say_zipper(z) {
    z = z.unzip()
    if(z.focus === void(0)) return z.list.flatten()
    let focus = z.focus, count = 1
    while(focus === (z = z.unzip()).focus) { z = z.remove(); ++count; }
    z = z.zip().update([count,focus])
    return look_and_say_zipper(z)
}
const look_and_say = l => look_and_say_zipper(l.toZipper())
```

and execute...
```Javascript
// 1, 11, 21, 1211, 111221, 312211, 13112221, 1113213211

look_and_say(retake.of(2,1)) // 1,2,1,1
look_and_say(retake.of(1,2,1,1)) // 1,1,1,2,2,1
```

Both versions (a, b) of look_and_say function reduce the list recursively, while tracking and recording occurence of each element. 

In a) occurrence of an element and its value is appended to an accumulator, which becomes the result as the list is completely reduced. 
Using the *splitWhen* transform, we get occurrence and list of remaining elements.

In b) first occurrence of element is replaced by an array of [count, value], whereas consequent occurrences are removed. 
In the end, the *flatten* transform, pulls count and sticks it as an element that precedes the actual value. 
Note how the list is probed with *unzip/zip* Zipper transforms.

*Both techniques show the power of using immutable values to (de)compose data.*

Now we can form a sequence and consume lazily.

```Javascript
const base = retake.of(1)
let seq = retake.seq(l => l ? look_and_say(l) : base)

for(let e of seq.take(12)) console.log(...e)
//1, 11, 21, 1211, 111221, 312211, 13112221, 1113213211
```

## Documentation

API documentation will be available soon. Try out the test suite for more thorough examples.

## Research Credits

- Rich Hickey for Transducers
- Gérard Huet for Zipper

## License

MIT