'use strict';

const { expect } = require( 'chai' );
const { Report } = require( 'refutable' );
const { BinTree, TreeNode } = require('../btree/bintree');

describe( 'BinTree', () => {
  it('can insert & enumerate', done => {
    const bt = new BinTree((x, y) => x-y);

    bt.add(1).add(2).add(7).add(5);

    expect( [...bt.inorder()] ).to.deep.equal([1,2,5,7]);

    done();
  })
});

describe( 'TreeNode', () => {
  it('survives tilt', done => {
    const root = new TreeNode(4,
      new TreeNode(2,
        new TreeNode(1),
        new TreeNode(3)
      ),
      new TreeNode(6,
        new TreeNode(5),
        new TreeNode(7)
      )
    );
    expect([...root.inorder()]).to.deep.equal([1,2,3,4,5,6,7]);
    root.tiltRight();
    expect([...root.inorder()]).to.deep.equal([1,2,3,4,5,6,7]);
    root.tiltLeft();
    expect([...root.inorder()]).to.deep.equal([1,2,3,4,5,6,7]);
    done();
  });

  it( 'is self-balancing', done => {
    const bt = new BinTree((x,y) => x-y);
    for (let i = 0; i < 100; i++)
      bt.add(i);
    console.log(bt.debug());
    const report = bt.selfCheck();
    // console.log(''+report);
    // expect( report.getPass() ).to.equal(true);
    done(report.getPass() ? '' : ''+report);
  });
})
