'use strict';

const { BigoBench } = require( '../lib/bigobench' );
const { PQueue } = require( '../queue/pqueue-closure' );

const bench = new BigoBench()
  .setup( (n, cb) => {
    cb( [...new Array(n).keys()].sort( () => Math.random() - 0.5 ) );
  });

const probe = (list, cb) => {
  const pq = new PQueue();
  for (const i of list)
    pq.push(i);
  const out = [];
  while (pq.length())
    out.push( pq.shift() );
  cb(out);
}

for (const n of [10 ** 4, 10 ** 5 , 10 ** 6])
  bench.run( n, probe ).then(console.log);
