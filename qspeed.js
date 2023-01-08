'use strict';

const { BigoBench } = require( './lib/bigobench' );
const { PQueue } = require( './pqueue-closure' );

const bench = new BigoBench()
  .setup( n => {
    return [...new Array(n).keys()].sort( () => Math.random() - 0.5 );
  });

const probe = list => {
  const pq = new PQueue();
  for (const i of list)
    pq.push(i);
  const out = [];
  while (pq.length())
    out.push( pq.shift() );
  return out;
}

for (const n of [10 ** 6])
  console.log(bench.run( n, probe ));
