Retake
=========================

Pragmatic data structure and algorithmic transformations for modern Javascript apps.


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
Arrays and Objects in Javascript are highly efficient and provide a flexible API. 
However their primitive purpose does not extend well in design of application domain models. 
This is specially true for web apps (React, Redux, Flux) where UIs can be described as a function of application state.

ES2015 has introduced game-changing features (for e.g. generator functions, lambdas, iteration protocols) that enable functional concepts to be expressed more succinctly. 
As a result, we've benefited from libraries such as Immutable.js and Mori that offer an assortment of fully persistent data structures.


## Introduction

Retake is a more focused, refined solution to managing *pieces of data* your app cares about at any given time. 
It comprises of a Lazy List implementation and auxiliary functions to allow efficient traversal and updates. It aims to offer practical solutions to most common challenges faced by Javascript developers in data handling. 
The overhead of persistence and transformations is isolated from your app logic.

This implementation covers 3 important facets:

  - Lazy List - provides an immutable persistent collection to organize data linearly using head/tail decomposition with lazy evaluation. *Retake* is always free.
  - Transforms - provide an integrated way to compose and apply algorithmic transformations to data structures.
  - List Zipper - facilitates efficient traversal and updates to encompassing linear data structure.

That's very much the gist of it! Refer to implementation details to learn the inner workings.

Prerequisite readings:
- [Persistent Data Structure](https://en.wikipedia.org/wiki/Persistent_data_structure)
- [Transducers](https://www.youtube.com/watch?v=6mTbuzafcII) by Rich Hickey
- [Zipper](https://en.wikipedia.org/wiki/Zipper_(data_structure) by Gérard Huet

##
