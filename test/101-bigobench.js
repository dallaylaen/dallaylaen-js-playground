const { expect } = require('chai');
const { BigoBench } = require('../lib/bigobench');

describe('BigoBench', () => {
  it('runs some code & provides summary', (done) => {
    const perf = new BigoBench()
      .setup((n, cb) => cb([...Array(n).keys()].reverse()))
      .teardown((array, cb) => {
        for (let i = 1; i < array.length; i++) {
          if (array[i - 1] > array[i])
            cb('array out of order' + array.join(', '));
        }
        cb();
      });

    const prom = perf.run(10000, (ary, cb) => cb(ary.sort((x, y) => x - y)) );

    prom.then(out => {
      console.log(out);

      expect(out.n).to.equal(10000);
      expect(out.user).to.be.within(0, Infinity);
      expect(out.system).to.be.within(0, Infinity);
      expect(out.elapsed).to.be.within(0, Infinity);
      // expect(out.cpu).to.be.within(0, Infinity);

      done();
    });
  });

  it ('has sane default setup & teardown', done => {
    new BigoBench().run(1, (n, cb) => cb(n) ).then(() => done());
  })
});
