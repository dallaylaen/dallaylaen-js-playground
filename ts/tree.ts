type Tree<T> = null | {val: T, left: Tree<T>, right: Tree<T>};

function inorder<T>(root: Tree<T>): T[] {
    if (root === null)
        return [];
    return inorder(root.left).concat([root.val]).concat(inorder(root.right));
}

const myTree : Tree<number> = {val: 42, left: {val: 11, left: null, right: null}, right: {val: 137, right: null, left: null}};

console.log(inorder(myTree));

