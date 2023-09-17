/**
 *  Test how iterating over the same function behaves dependent on whether
 *  it's a direct callback, promise, setImmediate, setTimeout(0), or process.nextTick
 *
 */

const iter = 100;


setImmediate(() => {
  redo('immediate', iter, 0, setImmediate);
  redo('timeout', iter, 0, f => setTimeout(f, 0));
  redo('nextTick', iter, 0, process.nextTick);
  redo('promise', iter, 0, f => Promise.resolve(0).then(f));
  redo('plain js', iter, 0, f => f());
});



function redo(name, max, n, cb) {
  if (n >= max) {
    console.log(name, 'finished');
    return;
  }
  console.log(name, n);
  cb(() => redo(name, max, n+1, cb));
}
