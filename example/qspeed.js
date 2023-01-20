'use strict';

const { BigoBench } = require( '../lib/bigobench' );
const refute = require( 'refutable' );
const { PQueue } = require( '../queue/pqueue-closure' );


const FETCH = 100;

const bench = new BigoBench()
  .setup( (n, cb) => {
    cb( [...new Array(n).keys()].sort( () => Math.random() - 0.5 ) );
  })
  .teardown( (ret, cb ) => {
    const report = refute.report( r => {
      r.type(ret, 'array');
      r.equal( ret.length, FETCH );
      r.ordered( 'ret is ascending', ret, (r, x, y) => {
        r.cmpNum(x, '<', y);
      })
    });
    cb( report.getPass() ? undefined : ''+report );
  });

const probe = (list, cb) => {
  const pq = new PQueue();
  for (const i of list)
    pq.push(i);
  const out = [];
  for (let i = 0; i < FETCH; i++)
    out.push( pq.shift() );
  cb(out);
}

bench.compare({minArg: 100, maxArg: 1000000, maxTime: 1}, {
  pqueue: probe,
  sort: (list, cb) => cb(list.sort((x, y) => x - y).slice(0, FETCH)),
}).then(console.log);
