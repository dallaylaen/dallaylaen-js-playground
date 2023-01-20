'use strict';

const { expect } = require( 'chai' );
const { BinTree } = require('../btree/bintree');

describe( 'BinTree', () => {
  it('can insert & enumerate', done => {
    const bt = new BinTree(100);
    expect( bt.add(50) ).to.equal( bt );
    bt.add(200).add(350).add(75);

    expect([...bt.iterate()] ).to.deep.equal([50, 75, 100, 200, 350]);
    expect([...bt.iterate(77, 203)] ).to.deep.equal([100, 200]);

    expect(bt.has(100)).to.equal(true);
    expect(bt.has(101)).to.equal(false);

    const report = bt.validate();

    console.log(report.toString());
    expect( report.getPass() ).to.equal(true);

    done();
  })
})
