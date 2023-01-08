/**
 * @desc parametric performance testing.
 */

class BigoBench {
  constructor () {
    this._setup = (n) => n;
    this._teardown = () => {};
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
    const arg = this._setup(n);
    const el0 = new Date();
    const t0 = process.cpuUsage();

    const res = fun(arg);

    const t1 = process.cpuUsage();
    const el1 = new Date();
    this._teardown(res, arg);

    const user = (t1.user - t0.user) / 10 ** 6;
    const system = (t1.system - t0.system) / 10 ** 6;
    const combined = user + system;

    return {
      n,
      user,
      system,
      combined,
      elapsed: (el1 - el0) / 1000,
      iter:    combined / n,
    };
  }
}

module.exports = { BigoBench };
