

class Tree<T> {
    val: T;
    left: Tree<T> | null;
    right: Tree<T> | null;
    _order: (T, T) => number;
    _merge: (T, T) => T;
    constructor(order: (T, T) => number, merge: (T, T) => T = (before, after) => after) {
        this._order = order;
        this._merge = merge;
    }
    add(val: T): Tree<T> {
        if (this.val === undefined) {
            this.val = val;
            return this;
        }
        const dir = this._order(val, this.val);
        if (dir === 0) {
            this.val = this._merge(this.val, val);
            return this;
        };
        
        const descend = dir < 0
            ? this.left ??= new Tree<T>(this._order, this._merge)
            : this.right ??= new Tree<T>(this._order, this._merge);
        
        descend.add(val);
        return this;
    }
}



