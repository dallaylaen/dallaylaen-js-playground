'use strict';
/**
 *  Frobenius problem aka Coin problem:
 *  https://en.wikipedia.org/wiki/Coin_problem
 *
 *  Given a set of setwise-coprime natural numbers,
 *  find the largest number that cannot be represented
 *  as a sum of the numbers in set with repetitions.
 *  It can be shown that such number always exists.
 */

/*
const cases = [
  [2, 3],
  [2, 7],
  [7, 2],
  [2, 17],
  [3, 5],
  [5, 7],
  [6, 10, 15],
  [4, 6],
  [42, 70, 105],
  [101, 103],
  [201, 203],
  [301, 303],
  [30, 105, 42, 70],
  [2310 / 2, 2310 / 3, 2310 / 5, 2310 / 7, 2310 / 11],
  [2310 / 14, 2310 / 15, 2310 / 11],
  [14, 15],
  [14, 15, 16],
  [21, 24, 28],
  [33, 34, 35],
  [33, 35],
  [21, 34],
  [34, 55],
  [6006, 6015, 6010],
  [2102, 2103, 2105, 2107],
];
*/
/*
  for (const seed of cases)
    console.log( seed, ' -> ', inconstructible(...seed))
*/

for (let n = 1; n <= 60; n++) {
  const possible = [...splitCoprime(n)];
  if (possible.length === 0)
    continue;
  // console.log(n, '=>', possible);

  let max = 0;
  let best;
  for (const arg of possible) {
    const curr = inconstructible(...arg);
    if (curr > max) {
      max = curr;
      best = arg;
    }
  }
  console.log(n, best, max);
}

function stat(list) {
    let sum = 0, prod = 1;
    for (let x of list) {
        sum += x;
        prod *= x;
    };
    return {
        n: list.length,
        min: Math.min(...list),
        max: Math.max(...list),
        sum,
        prod,
    }
};

function inconstructible (...seed) {
  seed = [...seed].sort((x, y) => x - y); // don't destroy orig array
  if (euclid(...seed) !== 1)
    return Infinity;
  let candidate = seed[0] - 1;
  const cache = new Set([0]);
  num: for (let n = seed[0] - 1; ;n++) {
    if (n - candidate > seed[0] + 1)
      return candidate;
    for (const i of seed) {
      if (cache.has(n - i)) {
        cache.add(n);
        continue num;
      }
    }
    candidate = n;
  }
}

function* splitCoprime (n, min = 2, common = 0, log = []) {
  while (n > min * 2) {
    yield * splitCoprime(n - min, min + 1, euclid(common, min), [...log, min]);
    min++;
  }
  if (n >= min && euclid(common, n) === 1)
    yield [...log, n];
}

function euclid (...seed) {
  while (seed.length > 1) {
    const next = seed.shift() % seed[0];
    if (next !== 0)
      seed.push(next);
  }
  return seed[0];
}
