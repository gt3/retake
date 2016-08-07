class Node {
    constructor(value) {
        this.value = value
    }
}

const sentinel = new class extends Node { get sentinel() { return true } }

module.exports = {Node, sentinel}