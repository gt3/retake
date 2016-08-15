Retake
=========================

Pragmatic data structure and algorithmic transformations for modern Javascript apps.

Primary goal of Retake is to shift complexity from code to data. This implementation covers 3 important facets:

  - List - provides an immutable persistent collection to organize data linearly using head/tail decomposition with support for lazy evaluation. *Retake* is always free.
  - Transforms - provide an integrated way to compose and apply algorithmic transformations to data structures.
  - List Zipper - facilitates efficient traversal and updates to linear data structures.


## Installation


- Node.js (v6.0.0)

```
npm install --save retake
```

- Transpiled, pre-built
```
npm install --save retake@built
```

Requires runtime support for ES6 built-ins:
    
- [`Generators`](https://babeljs.io/docs/plugins/transform-regenerator)
- [`Object.assign`](http://babeljs.io/docs/plugins/transform-object-assign)

