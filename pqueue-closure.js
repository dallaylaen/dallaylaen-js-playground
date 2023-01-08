'use strict';

function PQueue(better = (x, y) => x <= y) {
  const buf = new Array();

  this.push = function (item) {
    let index = buf.length;
    buf.push(item);

    // propagate leaf to root
    while (index > 0) {
      // calc parent node
      const next = index - 1 >> 1;
      // stop if invariant holds
      if (better(buf[next], buf[index]))
        break;

      // exchange & move to next index
      [buf[next], buf[index]] = [buf[index], buf[next]];
      index = next;
    }
    return this;
  }

  this.shift = function () {
    if (buf.length <= 1)
      return buf.pop();

    const best = buf[0];
    buf[0] = buf.pop();

    let index = 0;
    while (true) {
      // calculate children indices
      const left = index * 2 + 1;
      if (left >= buf.length)
        break;
      const right = left + 1;

      // select where to advance
      const next = (right < buf.length && better(buf[right], buf[left]))
        ? right
        : left;
      if (better(buf[index], buf[next]))
        break;

      // exchange & move to next index
      [buf[next], buf[index]] = [buf[index], buf[next]];
      index = next;
    }
    return best;
  }

  this.peek = function() {
    return buf[0];
  }

  this.length = function() {
    return buf.length;
  }
}

module.exports = { PQueue };
