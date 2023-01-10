const { expect } = require('chai');
const { PQueue } = require('../queue/pqueue-array');

describe('PQueue', () => {
  it('can sort stuff', (done) => {
    const pq = new PQueue();

    const sorted = [...Array(30).keys()];
    const input = sorted.map((x) => x).sort(() => Math.random() - 0.5);

    for (const i of input) pq.push(i);

    expect(pq.length).to.equal(sorted.length);

    const output = [];
    while (pq.length > 0) output.push(pq.shift());

    expect(output).to.deep.equal(sorted);

    done();
  });
});
