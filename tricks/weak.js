'use strict';

function guardedCallback(fun, onErasure) {
  const where = new Error('stack probe').stack.split('\n')[2];
  let done = false;
  const wrapper = function(...args) {
    done = true;
    return fun.apply(this, args);
  };
  const guard = new WeakRef(wrapper);

  const t0 = new Date();
  const timeAgain = () => {
    if (done) {
      console.log('callback executed at last');
      return;
    }
    if (!guard.deref())
      return onErasure(where, new Date() - t0);
    setTimeout( timeAgain, 250 );
  };

  timeAgain();
  return wrapper;
}

module.exports = { guardedCallback };
