const { expect } = require('chai');
const { BigoBench } = require('../lib/bigobench');

describe('BigoBench', () => {
  it('runs some code & provides summary', (done) => {
    const perf = new BigoBench()
      .setup((n) => [...Array(n).keys()].reverse())
      .teardown((array) => {
        for (let i = 1; i < array.length; i++) if (array[i - 1] > array[i]) throw new Error('foo bared');
      });

    const out = perf.run((ary) => ary.sort((x, y) => x - y), 10000);

    expect(out.user).to.be.within(0, Infinity);
    expect(out.system).to.be.within(0, Infinity);
    expect(out.elapsed).to.be.within(0, Infinity);

    console.log(out);

    done();
  });
});
