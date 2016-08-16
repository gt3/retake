Retake
=========================

Pragmatic data structure and algorithmic transformations for modern Javascript apps.

Primary goal of Retake is to shift complexity from code to data. This implementation covers 3 important facets:

  - Lazy List - provides an immutable persistent collection to organize data linearly using head/tail decomposition with lazy evaluation. *Retake* is always free.
  - Transforms - provide an integrated way to compose and apply algorithmic transformations to data structures.
  - List Zipper - facilitates efficient traversal and updates to linear sequential data.


## Installation


- Node.js (v6.0.0)

```
npm install --save retake
```

- Transpiled, pre-built

```
npm install --save retake@built
```

Required runtime support for ES6 built-ins:
    
- [`Generators`](https://babeljs.io/docs/plugins/transform-regenerator)
- [`Object.assign`](http://babeljs.io/docs/plugins/transform-object-assign)


## Motivation

ECMAScript, the language, lacks built-in support for advanced data structures. 
Arrays and Objects in Javascript are highly efficient and easy to operate on. 
However they are too basic and might not serve well in managing app-level complexity. 
This is specially true for web apps (React, Redux, Flux) where UI needs to stay in sync with constantly updating app-state (data).

ES2015 has introduced game-changing features (for e.g. generator functions, lambdas, iteration protocols) that enable expressing functional concepts more succintly.

Immutable.js and Mori.js are full-fledged libraries that support a variety of immutable data structures to solve this very problem.

Retake is a more focused, lightweight solution to manage a *collection of any data* your app cares about at any given time. Complexity of persistence and transformations is isolated from your app into the data structure.

It offers immutability for your data with a friendly API. 
It has integrated support for algorithmic transformations (see [transducers](https://www.youtube.com/watch?v=6mTbuzafcII)) and List Zippers.