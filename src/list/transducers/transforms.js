const sort = require('./transforms-sort')
const flatten = require('./transforms-flatten')
const {identity, getComparer, wrap, unwrap} = require('../../utils')

class Reducers {
    static prepend(acc, node, next) {
        return next ? next(acc.prepend(node)) : acc
    }
    static append(acc, node, next) {
        return next ? next(acc.append(node)) : acc
    }
    static counter(acc, node, next) {
        return next ? next(acc+1) : acc
    }
}

class Transformers {
    static map(fn) {
        return (reducer) => function mapping(acc, node, next) {
            if(!next) return reducer(acc)
            const value = unwrap(node), wrapCheck = check => check === value ? node : wrap(check)
            return reducer(acc, wrapCheck(fn.call(value, value)), next)
        }
    }
    static filter(pred) {
        return (reducer) => function filtering(acc, node, next) {
            if(!next) return reducer(acc)
            const value = unwrap(node)
            return pred.call(value, value, acc) ? reducer(acc, node, next) : next(acc)
        }
    }
    static take(n) {
        return (reducer) => (acc, node, next) => 
            !next ? reducer(acc) : (--n > 0) ? reducer(acc, node, next) : reducer(acc, node, identity)
    }
    static skip(n) {
        return (reducer) => (acc, node, next) =>
            !next ? reducer(acc) : (--n >= 0) ? next(acc) : reducer(acc, node, next)
    }
    static takeUntil(pred) {
        return (reducer) => function takingUntil(acc, node, next) {
            if(!next) return reducer(acc)
            const value = unwrap(node)
            return !pred.call(value, value, acc) ? reducer(acc, node, next) : reducer(acc)
        }
    }
    static flatten(level=1) { return flatten(level) }
    static sort(sortKey='key', asc=true, comparer=getComparer(sortKey,asc)) { return sort(comparer) }
}

class Splitters {
    static splitWhen(pred) {
        return (reducer) => function splittingWhen(acc, node, next) {
            const value = unwrap(node)
            return !next || pred.call(value, value) ? reducer(acc.makeSiblingOf(this)) : reducer(acc, node, next)
        }
    }
    static splitAt(n) {
        return Splitters.splitWhen(() => --n < 0)
    }
}

module.exports = {Transformers, Splitters, Reducers}