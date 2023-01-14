'use strict';
/* global process: readonly, module: readonly */

/**
 * @desc parametric benchmarking.
 */
class BigoBench {
  constructor () {
    this._setup = (n, cb) => cb(n);
    this._teardown = (_, cb) => cb();
  }
  
  setup (fun) {
    this._setup = fun;
    return this;
  }

  teardown (fun) {
    this._teardown = fun;
    return this;
  }

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
      const combined = user + system;

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
}

module.exports = { BigoBench };
