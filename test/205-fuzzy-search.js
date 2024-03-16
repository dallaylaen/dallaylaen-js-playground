'use strict';

const { expect } = require('chai');
const { fuzzy }  = require('../skill/fuzzy-rex');

console.log(fuzzy);

describe('fuzzy search', () => {
  const cases = [
    // 0
    ["fuzzy"],
    // 1
    ["fzzy", "fuzzi", "_fuzzy", "fzuzy"],
    // 2
    ["fzuzi", "_fuzzy_", ],
    // 3
    ["uf_yz"],
    // 4
    ["f_u_z_z_y", "f", "y"],
    // 5
    ["fuzzyfuzzy"],
  ];

  for (let allow = 0; allow <= 5; allow++) {
    const rex = fuzzy("fuzzy", allow);
    for (let dist = 0; dist < cases.length; dist++) {
      for (let str of cases[dist]) {
        it ('recognizes "'+str+'" with fuzz = '+allow, done => {
          expect( !!str.match(rex) ).to.equal (dist <= allow);
          done();
        });
      }
    }
  }
})
