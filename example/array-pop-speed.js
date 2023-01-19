'use strict';

const { BigoBench } = require ('../lib/bigobench');

const bench = new BigoBench().setup((n, cb) => cb([...new Array(n).keys()].map(x => x + 1)));

bench.compare(
  {maxTime: 1, minArg: 1000, maxArg: 100000},
  {
    shift: (ary, cb) => { let sum = 0; while (ary.length) sum += ary.shift(); cb(sum); },
    pop:   (ary, cb) => { let sum = 0; while (ary.length) sum += ary.pop(); cb(sum); },
  }
).then(got => console.log(got));
