'use strict';

const { Report } = require( 'refutable' );

class TreeNode {
  constructor(val, left, right) {
    this.val = val;
    this.left = left;
    this.right = right;
    this.reheight();
  }

  add(val, order, merge) {
    const dir = order(val, this.val);
    if (dir === 0) {
      this.val = merge(this.val, val);
    } else if (dir < 0) {
      if (this.left) {
        this.left.add(val, order, merge);
        this.balance();
      } else {
        this.left = new TreeNode(val);
      }
      this.reheight();
    } else {
      if (this.right) {
        this.right.add(val, order, merge);
        this.balance();
      } else {
        this.right = new TreeNode(val);
      }
      this.reheight();
    }
  }

  *inorder() {
    if (this.left)
      yield* this.left.inorder();
    yield this.val;
    if (this.right)
      yield* this.right.inorder();
  }

  tilt() {
    return (this.right?.height ?? 0) - (this.left?.height ?? 0);
  }

  reheight() {
    this.height = 1 + Math.max( this.left?.height ?? 0, this.right?.height ?? 0 );
  }

    /*
           m                   l
      l        r    <->    ll        m
   ll   lr                       lr    r
     */
  tiltRight() {
    [this.val, this.left.val] = [this.left.val, this.val];
    const l = this.left, ll = l.left, lr = l.right, r = this.right;
    l.left = lr;
    l.right = r;
    this.left = ll;
    this.right = l;
    l.reheight();
    this.reheight();
    return this;
  }
  tiltLeft() {
    [this.val, this.right.val] = [this.right.val, this.val];
    const r = this.right, rr = r.right, rl = r.left, l = this.left;
    r.right = rl;
    r.left = l;
    this.right = rr;
    this.left = r;
    r.reheight();
    this.reheight();
    return this;
  }

  balance() {
    const tilt = this.tilt();
    if (tilt > 1) {
      // rotate left
      if (this.right.tilt() < 0)
        this.right.tiltRight();
      this.tiltLeft();
    } else if (tilt < -1) {
      if (this.left.tilt() > 0)
        this.left.tiltLeft();
      this.tiltRight();
    }
    return this;
  }

  debug(prefix = '') {
    return ''
      + (this.left ? this.left.debug(prefix + '  ') : '')
      + prefix + '[' + this.height + '] ' + this.val + '\n'
      + (this.right ? this.right.debug(prefix + '  ') : '')
  }
}

class BinTree {
  constructor (comparator, merge = (oldv, newv) => newv) {
    this._comparator = comparator;
    this._merge = merge;
    this._root = null;
  }
  add(val) {
    if (!this._root) {
      this._root = new TreeNode(val);
    } else {
      this._root.add(val, this._comparator, this._merge);
    }
    return this;
  };

  *inorder() {
    if (this._root)
      yield* this._root.inorder();
  }

  debug() {
    return this._root.debug();
  }

  selfCheck() {
    const report = new Report();
    const comp = this._comparator;
    const checkNode = (node, path) => {
      if (!node) {
        report.check(0, 'empty node at '+path);
        return {height: 0}
      }
      const left = checkNode(node.left, path + 'l');
      const right = checkNode(node.right, path + 'r');
      report.nested('check node at ' + path, inner => {
        inner.equal(node.height, 1+Math.max(right.height, left.height), 'height is correct');
        inner.within(node.tilt(), -1, 1, 'left/right subtrees of similar height');
        if (left.max)
        inner.cmpNum(comp(left.max, node.val), '<', 0, 'left subtree less than root')
        if (right.min)
          inner.cmpNum(comp(right.min, node.val), '>', 0, 'right subtree greater than root')
      });
      return {
        height: node.height,
        min: left.min ?? node.val,
        max: right.max ?? node.val,
      }
    }
    checkNode(this._root, '$');
    return report;
  }
}


module.exports = { BinTree, TreeNode };
