const {empty} = require('../list/factory')
const {Reducers: {prepend,append,counter}, Splitters: {splitAt}} = require('../list/transducers/transforms')
const reverse = (list) => list.reduce(prepend)

class ZipperTarget {
    constructor(target) { this._target = target }
    get focus() { return this._target.first }
    get size() { return this._target.reduce(counter, 0) }
    get resultList() { return reverse(this._target) }
    get list() { return this._target }
    [Symbol.iterator](...args) { return this.resultList[Symbol.iterator](...args) }
    update(value) { return this._target.tail.prepend(value) }
    remove() { return this._target.tail }
    updateWhen(pred, getValue) {
        return ZipperTarget.updateMany(new Zipper(this._target), pred, z => z.update(getValue(z.focus)))
    }
    removeWhen(pred) {
        return ZipperTarget.updateMany(new Zipper(this._target), pred, z => z.remove())
    }
    static updateMany(zipper, pred, action) {
        let gen = ZipperTarget.unzipper(zipper)
        let {value:unzipped, done} = gen.next()
        while(!done) {
            ({value:unzipped = unzipped, done} = pred(unzipped.focus) ? gen.next(action(unzipped)) : gen.next(unzipped))
        }
        return unzipped.list
    }
    static *unzipper(zipper) {
        let unzipped = zipper.unzip()
        while(unzipped.focus) unzipped = (yield unzipped).unzip()
        return unzipped
    }
}

class Zipper extends ZipperTarget {
    static create(...args) {
        return !args || !args.length ? new Zipper(this) : new Zipper(...args)
    }
    constructor(right, target=empty, left=empty) {
        super(target)
        Object.assign(this, {_left:left, _right:right})
    }
    get list() {
        return this._right.prependInReverse(super.list).prependInReverse(this._left)
    }
    unzip(howMany = 1) {
        const [result, right] = this._right.reduce(splitAt(howMany)(prepend))
        const left = this._left.prependCollection(super.list)
        return new Zipper(right, result, left)
    }
    zip(howMany = 1) {
        const [result, left] = this._left.reduce(splitAt(howMany)(append))
        const right = this._right.prependInReverse(super.list)
        return new Zipper(right, result, left)
    }
    update(value) {
        return new Zipper(this._right, super.update(value), this._left)
    }
    remove() {
        return new Zipper(this._right, super.remove(), this._left)
    }
    updateWhen(pred, getValue) {
        return new Zipper(this._right, super.updateWhen(pred, getValue), this._left)
    }
    removeWhen(pred) {
        return new Zipper(this._right, super.removeWhen(pred), this._left)
    }
    load(iterable) {
        const right = this._right.appendCollection(iterable)
        return new Zipper(right, super.list, this._left)
    }
}

module.exports = { toZipper: Zipper.create }