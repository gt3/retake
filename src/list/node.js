class Node {
    constructor(value) {
        console.log('\t\t',value,'new Node <<<<')
        this.value = value
    }
}

const sentinel = new class extends Node { get sentinel() { return true } }

module.exports = {Node, sentinel}