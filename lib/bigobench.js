'use strict';
/* global process: readonly, module: readonly */

/**
 * @typedef {Object} CpuStat
 * @property {int} n - initial int the argument was generated from
 * @property {Number} user - time spent in user space
 * @property {Number} user - CPU time spent in userspace
 * @property {Number} system - CPU time spent in kernel space
 * @property {Number} cpu - combined CPU time (user + system)
 * @property {Number} elapsed - total wall clock time spent
 * @property {Number} iter - combined CPU time per unit of n (=== cpu / n)
 * @property {Any} [err] - if present, indicates that the output was not as expected
 *
 * All times are in seconds, with available precision.
 * All times exclude setup, teardown, and surrounding code.
 */

/**
 * @desc Asynchronous parametric benchmarking library.
 *
 * A snippet of code is executed with different parameter values,
 * where parameter affects (or at least is expected to) the execution time.
 *
 * Before each execution input data is formed by a setup() hook.
 * The default one just forwards the n parameter.
 * After each execution the result may be tested to actually be correct,
 * as well as deinitialization performed, via teardown() hook.
 *
 * So instead of endlessly repeating the same code over and over again,
 * we try to plot execution time vs the parameter and hopefully find
 * interesting occasions such as cache pollution or the intersection between
 * a fast but naive implementation and a slower but asymptotically better approach.
 *
 * cpu time (user + system) is measured as well as physical (aka wall clock) time.
 *
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
   * @returns {Promise<CpuStat>}
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
      const cpu = user + system;

      const ret = {
        n,
        user,
        system,
        cpu,
        elapsed: (date2 - date1) / 1000,
        iter:    cpu / n,
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
   * @param {array<int>} [options.argList] argument to compare at
   * @param {int} [options.minArg]
   * @param {int} [options.maxArg]
   * @param {number} [options.maxTime]
   * @param {object} variants name => function, name2 => function2 ...
   * @returns {Promise<Object<String, Array<CpuStat>>>}
   * @example bench.compare( {minArg: 1, maxArg: 10**6, maxTime: 1] }, { qSort, bubbleSort, mergeSort } )
   *              .then( data => { for (let name in data) { plotRuntime( data[name] )}} );
   */
  compare (options = {}, variants = {}) {
    const minArg = options.minArg ?? 1;
    const maxArg = options.maxArg ?? Infinity;
    const maxTime = options.maxTime;

    if (maxArg === Infinity && !maxTime && !options.argList)
      throw new Error('One of maxArg, maxTime, of argList must be specified');

    const probes = options.argList ?? (function* () {
      for (let i = minArg; i <= maxArg; i = Math.ceil(i * 4 / 3))
        yield i;
    })();

    const gen = (function* () {
      for (const n of probes) {
        if (Object.keys(variants).length === 0)
          return;
        for (const name in variants)
          yield { name, n };
      }
    })();

    const out = {};
    const timeSpent = {};
    for (const key in variants) {
      out[key] = [];
      timeSpent[key] = 0;
    }

    const repeat = resolve => {
      const next = gen.next().value;
      if (!next)
        return resolve(out);

      const { name, n } = next;
      return this.run(n, variants[name]).then( piece => {
        const cpu = timeSpent[name] += (piece.cpu ?? 0);
        if (cpu > maxTime)
          delete variants[name]; // had enough
        out[name].push(piece);
        repeat(resolve);
      });
    }

    return new Promise(repeat);
  }
}

module.exports = { BigoBench };
