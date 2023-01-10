
class PQueue extends Array {
  constructor (better) {
    super(0);
    this.better = better ?? ((x, y) => x <= y);
  }

  push (item) {
    let index = this.length;
    super.push(item);

    // propagate leaf to root
    while (index > 0) {
      // calc parent node
      const next = index - 1 >> 1;
      // stop if invariant holds
      if (this.better(this[next], this[index]))
        break;

      // exchange & move to next index
      [this[next], this[index]] = [this[index], this[next]];
      index = next;
    }
  }

  shift () {
    if (this.length <= 1)
      return super.pop();

    const best = this[0];
    this[0] = super.pop();

    let index = 0;
    while (1) {
      // calculate children indices
      const left = index * 2 + 1;
      if (left >= this.length)
        break;
      const right = left + 1;

      // select where to advance
      const next = (right < this.length && this.better(this[right], this[left]))
        ? right
        : left;
      if (this.better(this[index], this[next]))
        break;

      // exchange & move to next index
      [this[next], this[index]] = [this[index], this[next]];
      index = next;
    }
    return best;
  }
}

module.exports = { PQueue };
