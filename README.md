Retake
=========================

Pragmatic data structure and algorithmic transformations for modern Javascript apps.


## Installation


```
npm install retake
```

## Usage

- Node (6 or later)

```
let retake = require('retake')
```

- Browser (gzips to *~5k*)

```
// es6
<script src="./node_modules/retake/lib/retake.js"></script>

// transpiled
<script src="./node_modules/retake/lib/retake.es5.js"></script>

// minified
<script src="./node_modules/retake/lib/retake.es5.min.js"></script>

// retake...

```

- For es5 versions - use [Babel polyfill](https://babeljs.io/docs/usage/polyfill/)

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.13.0/polyfill.min.js">
</script>
```


## Introduction

ECMAScript, the language, lacks built-in support for advanced data structures. 
Arrays and Objects in Javascript are highly efficient and provide a flexible API. 
However their mutative surface area does not serve well in design of concurrent systems. 
This is specially true for web apps (React, Flux, Redux et al.) where UIs can be described as a function of application state in a constant fold of events. 
Referential transparency is imperative, hence the demand for functional data structures.

ES2015 has introduced game-changing features (for e.g. generator functions, lambdas, iteration protocols, proper tail calls) that 
improve performance and offer great flexibility in representing computations. 
As a result, we've benefited from libraries such as Immutable.js and Mori that offer an assortment of fully persistent data structures.

Retake takes a more pragmatic, refined approach in managing *pieces of data* your app cares about *at any given time*.
It is comprised of List, Zipper, and Transforms that enable proper organization of data for efficient traversal and updates. 
These functional concepts are implemented and exposed in a way to meet requirements of modern Javascript apps. 
The end goal is to free app domain of procedural code by isolating the overhead of persistence and retrieval.

This implementation covers 3 important facets:

  - Lazy List - provides an immutable persistent collection to organize data linearly using head/tail decomposition with lazy evaluation. *Retake* is always free.
  - Transforms - provide an integrated way to compose and apply algorithmic transformations to data structures.
  - List Zipper - facilitates efficient traversal and updates to encompassing linear data structure.

That's very much the gist of it! Checkout the code examples below.

By the way, it should be clear that list-based structures are primarily purposed for sequential access unlike Vectors that are index-based.

Helpful readings:
- [Persistent Data Structure](https://en.wikipedia.org/wiki/Persistent_data_structure)
- [Transducers](http://clojure.org/reference/transducers) by Rich Hickey
- [Zipper](https://en.wikipedia.org/wiki/Zipper_(data_structure)) by Gérard Huet


## Code Examples

### Look-and-say numbers

Watch this [video](https://youtu.be/ea7lJkEhytA?list=PLt5AfwLFPxWIL8XA1npoNAHseS-j1y-7V) by John Conway for an introduction to this sequence.

Let's first implement a function that produces the "look and say" (next element in sequence).

### a. Using Transforms on List
```Javascript
//1, 11, 21, 1211, 111221, 312211, 13112221, 1113213211

function look_and_say(l, acc=empty) {
    if(l.done) return acc
    let target = l.first, count = 0
    let split = l.splitWhen(v => !(target === v && ++count))
    acc = acc.append(count, target)
    return look_and_say(split.tail.first, acc)
}

look_and_say(retake.of(1,2,1,1)) //1,1,1,2,2,1
```

### b. Using List Zipper
```Javascript
function look_and_say_zipper(z) {
    z = z.unzip()
    if(z.focus === void(0)) return z.list.flatten()
    let target = z.focus, count = 1
    while(target === (z = z.unzip()).focus) { z = z.remove(); ++count; }
    z = z.zip().update([count,target])
    return look_and_say_zipper(z)
}
const look_and_say = l => look_and_say_zipper(l.toZipper())

look_and_say(retake.of(1,2,1,1)) //1,1,1,2,2,1
```
Now we can make this into a lazy sequence and pull elements as needed.

```Javascript
const base = retake.of(1)
let seq = retake.seq(l => l ? look_and_say(l) : base)
for(let e of seq.take(12)) console.log(...e)
//1, 11, 21, 1211, 111221, 312211, 13112221, 1113213211
```
