'use strict';
/* global process: readonly, module: readonly */

/**
 * @desc Parametric benchmarking.
 * @example
 *  const bench = new BigoBench().setup(myFunction).teardown(otherFunction);
 *  bench.run((arg, cb) => { for (let i = 0; i &lt; arg; i++) doStuff(); cb() })
 *    .then(console.log);
 */
class BigoBench {
  constructor () {
    this._setup = (n, cb) => cb(n);
    this._teardown = (_, cb) => cb();
  }

  /**
   * @desc Create initial argument for function under test from a positive integer n.
   * Must be returned via callback.
   * @param {function} fun (n: Int, callback: function(arg)) => { ... }
   * @returns {BigoBench}
   */
  setup (fun) {
    this._setup = fun;
    return this;
  }

  /**
   * Deallocate whatever resources were used for the benchmark, and also
   * test the result for validity.
   * @param fun (retVal, callback) => { ...; callback(err); }
   * @returns {BigoBench} self
   */
  teardown (fun) {
    this._teardown = fun;
    return this;
  }

  /**
   * @desc Execute benchmark.
   * @param n - positive integer parameter to generate input from.
   * @param fun (arg, callback) => {...; callback(retVal)}
   * @returns {Promise<hash>} hash contains:
   * <ul>
   *   <li>n - initial int the argument was generated from</li>
   *   <li>user - CPU time spent in userspace</li>
   *   <li>system - CPU time spent in kernel space</li>
   *   <li>cpu - combined CPU time (user + system)</li>
   *   <li>elapsed - total wall clock time spent</li>
   *   <li>iter - cpu time per unit of n (=== cpu/n)</li>
   *   <li>err - if present, indicates that output was not as expected</li>
   * </ul>
   * All times are in seconds, with available precision.
   * All times exclude setup, teardown, and surrounding code.
   */
  run (n, fun) {
    return new Promise( resolve => {
      this._setup(n, resolve)
    }).then( arg => new Promise( resolve => {
      const date1 = new Date();
      const cpu1 = process.cpuUsage();

      fun(arg, retVal => {
        const cpu2 = process.cpuUsage();
        const date2 = new Date();
        this._teardown(retVal, err => resolve({ err, date1, date2, cpu1, cpu2 }));
      })
    })).then( hash => new Promise( resolve => {
      const { cpu1, cpu2, date1, date2, err } = hash;

      const user = (cpu2.user - cpu1.user) / 10 ** 6;
      const system = (cpu2.system - cpu1.system) / 10 ** 6;
      const combined = user + system; // TODO rename -> cpu

      const ret = {
        n,
        user,
        system,
        combined,
        elapsed: (date2 - date1) / 1000,
        iter:    combined / n,
      };
      if (err)
        ret.err = err;
      resolve(ret);
    }));
  }

  /**
   * @desc Compare different solutions of the same problem, returning
   * a hash with solution runtime data (through a promise).
   * @param {object} options
   * @param {array<int>} [options.arg] argument to compare at
   * @param {object} variants name => function, name2 => function2 ...
   * @returns {Promise}
   * @example bench.compare( {arg: [1000, 10000, 100000] }, { qSort, bubbleSort, mergeSort } )
   *              .then( data => { for (let name in data) { plotRuntime( data[name] )}} );
   */
  compare(options = {}, variants ={}) {
    // TODO calculate arg spans
    const probes = options.arg;

    const gen = (function* () {
      for (let n of probes) {
        for (let name in variants) {
          yield {name, n};
        }
      }
    })();

    const out = {};
    for (const key in variants)
      out[key] = [];

    const repeat = resolve => {
      const next = gen.next().value;
      if (!next) {
        resolve(out);
      };
      const {name, n} = next;
      const prom = this.run(n, variants[name]);

      return prom.then(piece => {
        out[name].push(piece);
        repeat(resolve);
      });
    }

    return new Promise(repeat);
  }
}

module.exports = { BigoBench };
