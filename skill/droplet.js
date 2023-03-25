
class Droplet {
  /**
   * @desc Poor man's Fibonacci heap
   * @param {any} val
   */
  constructor (val){
    this.val = val;
    this.parent = null;
    this.children = [];
  }
  order() {
    return this.children.length;
  };
  size() {
    return 1+this.children.reduce((acc, item) => acc + (item ? item.size() : 0), 0);
  }

  root() {
    return this.parent === null ? this : this.parent.root();
  }

  merge(other, join) {
    let fst = this.root();
    let snd = other.root();

    if (fst === snd)
      return fst;

    if (fst.children.length < snd.children.length)
      [fst, snd] = [snd, fst];

    fst.val = join(fst.val, snd.val);
    fst._merge(snd);
    return fst;
  };

  _merge(other) {
    let ord = other.children.length;

    while (this.children[ord]) {
      other = this.children[ord]._merge(other);
      this.children[ord] = undefined;
      ord = other.children.length;
    }
    this.children[ord] = other;
    other.parent = this;
    delete other.val;
    return this;
  }

  getVal() {
    return this.root().val;
  }
}

module.exports = { Droplet };
