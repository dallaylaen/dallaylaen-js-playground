'use strict';

class BinTree {
  constructor (num) {
    this.val = num;
    this.left = null;
    this.right = null;
  }

  add (num) {
    if (this.val === undefined) {
      this.val = num;
      return this;
    }
    if (num < this.val) {
      if (this.left)
        this.left.add(num);
      else
        this.left = new BinTree(num);
    } else {
      if (this.right)
        this.right.add(num);
      else
        this.right = new BinTree(num);
    }
    return this;
  }

  has (num) {
    if (this.val === undefined)
      return false;
    if (this.val === num)
      return true;
    if (num < this.val)
      return this.left?.has(num) ?? false;
    else
      return this.right?.has(num) ?? false;
  }

  *iterate () {
    if (this.left)
      yield * this.left.iterate();
    if (this.val !== undefined)
      yield this.val;
    if (this.right)
      yield * this.right.iterate();
  }
}

module.exports = { BinTree }
