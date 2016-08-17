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
However their primitive purpose does not extend well in design of complex application domain models. 
This is specially true for web apps (React, Redux, Flux) where UIs can be described as a function of application state.

ES2015 has introduced game-changing features (for e.g. generator functions, lambdas, iteration protocols) that enable collection interfaces to be more flexible. 
As a result, we've benefited from libraries such as Immutable.js and Mori that offer an assortment of fully persistent data structures.

Retake takes a more focused, refined approach to managing *pieces of data* your app cares about at any given time. 
It comprises of a Lazy List implementation and auxiliary functions to allow efficient traversal and updates. 
It aims to offer practical solutions to most common challenges faced by Javascript developers in data handling by providing a flexible OO interface to functional data structures. 
As a result, the overhead of persistence and transformations is isolated from app logic leading to less procedural code.

This implementation covers 3 important facets:

  - Lazy List - provides an immutable persistent collection to organize data linearly using head/tail decomposition with lazy evaluation. *Retake* is always free.
  - Transforms - provide an integrated way to compose and apply algorithmic transformations to data structures.
  - List Zipper - facilitates efficient traversal and updates to encompassing linear data structure.

That's very much the gist of it! Refer to implementation details to learn the inner workings.

Prerequisite readings:
- [Persistent Data Structure](https://en.wikipedia.org/wiki/Persistent_data_structure)
- [Transducers](https://www.youtube.com/watch?v=6mTbuzafcII) by Rich Hickey
- [Zipper](https://en.wikipedia.org/wiki/Zipper_(data_structure) by Gérard Huet


## Code Examples

### State is a fold of events
```
let multiples = (base) => (n=0) => n+base
let times5 = retake.seq(multiples(5))
```