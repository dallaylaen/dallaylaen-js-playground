'use strict';

const { report } = require ('refutable');

class BinTree {
  constructor (num) {
    this.val = num;
    this.left = null;
    this.right = null;
    this.height = 1;
  }

  add (num) {
    if (this.val === undefined) {
      this.val = num;
      return this;
    }
    let h;
    if (num < this.val) {
      if (this.left)
        this.left.add(num);
      else
        this.left = new BinTree(num);
      h = this.left.height + 1;
    } else {
      if (this.right)
        this.right.add(num);
      else
        this.right = new BinTree(num);
      h = this.right.height + 1;
    }
    if (h > this.height)
      this.height = h;
    return this;
  }

  validate() {
    const nodes = function* (root, min, max) {
      if (root.left)
        yield* nodes(root.left, min, root.val);
      yield [root, min, max];
      if (root.right)
        yield* nodes(root.right, root.val, max);
    }

    return report(r => {
      for (const [node, min, max] of nodes(this, -Infinity, Infinity)) {
        r.nested('checking node '+node.val, r => {
          r.cmpNum(min, '<=', node.val, 'val within bounds (l)');
          r.cmpNum(node.val, '<=', max, 'val within bounds (r)');
          r.equal(node.height, 1+Math.max(node.left?.height ?? 0, node.right?.height ?? 0), 'check height')
        });
      }
    });
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

  *iterate (min=-Infinity, max=Infinity) {
    if (this.val === undefined)
      return;
    if (this.left && min <= this.val)
      yield * this.left.iterate(min, max);
    if (min <= this.val && this.val <= max)
      yield this.val;
    if (this.right && this.val <= max)
      yield * this.right.iterate(min, max);
  }
}

module.exports = { BinTree }
