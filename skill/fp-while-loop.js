/**
 * @desc repeat a function with callback as long as condition holds
 * @param {function(any): boolean} wantMore
 * @param {function(input: any, cb: function(any): void): void} iterate
 * @return {function(input: any, cb: function(any): void): void}
 */
function repeat(wantMore, iterate) {
  const again = (input, cb) => wantMore(input)
    ? iterate(input, next => again(next, cb))
    : cb(input);
  return again;
}

/**
 * @desc repeat a function with callback as long as condition holds
 * but put a delay between iterations
 * @param {function(any): boolean} wantMore
 * @param {function(input: any, cb: function(any): void): void} iterate
 * @return {function(input: any, cb: function(any): void): void}
 */
function slowRepeat(wantMore, iterate) {
  const again = (input, cb) => {
    if (wantMore(input)) {
      const t0 = utime();
      iterate(input, next => {
        setTimeout(() => again(next, cb), utime() - t0);
      });
    } else {
      cb(input);
    }
  }
  return again;
}

function utime() {
  const t = process.hrtime();
  return t[0] * 1000 + t[1] / 1000000;
}

// repeat(n => n <= 5, (n, cb) => { console.log(n); cb (n+1); })(1, () => {});


repeat(n => n > 0, (n, cb) => {console.log(n); cb(n-1)})(10000, () => {});
