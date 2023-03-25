'use strict';

const {expect} = require('chai');
const {Droplet} = require('../skill/droplet');

describe('Droplet', () => {
  it('can merge with other droplets', done => {
    const lake = [];
    for (let i = 1; i <= 10; i++)
      lake.push(new Droplet(i));

    for (let i = 1; i < lake.length; i++)
      lake[i-1].merge(lake[i], (x,y) => x+y);

    const main = lake[0].root();
    console.log(main);

    expect(main.getVal()).to.equal(55);
    expect(main.size()).to.equal(10);

    for(let i = 0; i<lake.length; i++)
      expect( lake[i].getVal() ).to.equal( 55 );
    done();
  })
})
