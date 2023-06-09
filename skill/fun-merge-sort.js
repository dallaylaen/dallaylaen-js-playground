

const split = head => head === null ? [null, null] : ((fst, snd) => [new List(head.val, snd), fst])(...split(head.next));
const merge = (l1, l2, better = (a,b) => a < b) => l1 == null ? l2 : l2 == null ? l1 : better(l1.val, l2.val) ? new List(l1.val, merge(l1.next, l2, better)) : new List(l2.val, merge(l2.next, l1, better));
const msort = (head, better = (a,b) => a<b) => head?.next ? merge(...split(head).map(part => msort(part, better)), better) : head;

class List {
  constructor(val, next=null) {
    this.val  = val;
    this.next = next;
  }
  toString() {
    return this.val + (this.next ? ', ' + this.next : '');
  }
}

List.from = (array, pos = 0) => pos >= array.length ? null : new List(array[pos], List.from(array, pos+1));
List.gen = (n, fun = x=>x, tail = null) => n <= 0 ? tail : List.gen(n-1, fun, new List(fun(n), tail));

// console.log(''+List.from([1,2,3,4,5]));

// console.log(''+List.gen(20, n => n * n));

const li = List.gen(20, _ => Math.floor(Math.random() * 10000));

console.log(''+li);

console.log(''+msort(li));

