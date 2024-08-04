(function () {
  class Rig {
      /**
       *
       * @param {{[key: string]: Element}} jar
       */
    constructor (jar) {
      this.view = jar;
      this.root = jar._;
    }

      /**
       *
       * @param {Element|string} parent
       * @return {Rig}
       */
    attachTo (parent) {
      if (typeof parent === 'string')
        parent = document.getElementById(parent);
      parent.appendChild(this.root);
      return this;
    }

      /**
       *
       * @param {string} name
       * @param {function(any): void} onChange
       */
    mkprop (name, onChange) {
      let current;
      Object.defineProperty(this, name, {
        get: () => current,
        set: v => {
          const save = current;
          try {
            current = v;
            onChange(v);
          } catch (e) {
            current = save;
            throw e;
          }
        }
      });
    }
  }

  function compileHTML (source, callback) {
    // create gantry afresh because we want reenterability
    const gantry = document.createElement('div');
    gantry.innerHTML = source;
    if (gantry.children.length !== 1)
      throw new Error('template must have exactly one root node');
    const root = gantry.children[0];
    gantry.remove();

    const jar = { _: root };
    collect(root, jar);
    return callback(root, jar);
  }

  /**
     *
     * @param {function(...[*]): void} init
     * @return {function(...[*]): Rig}
     */
  function mkrig (init) {
    // assume to be called from a script just below the template
    const original = document.currentScript.previousElementSibling;

    console.log('orig tag: ', original.tagName);
    // if script, must be a template
    const source = original.tagName === 'SCRIPT' ? original.innerHTML : original.outerHTML;

    console.log('source: ', source);

    // check validity
    compileHTML(source, () => {});

    return function (...args) {
      return compileHTML(source, (root, jar) => {
        const state = new Rig(jar)
        init.apply(state, args);
        return state;
      });
    };
  }

  function write (text) {
    this.innerHTML = '' + text;
    return this;
  }

  function showhide (visible) {
    this.hidden = !visible;
    return this;
  }

  function collect (root, jar) {
    if (root.id !== undefined) {
      if (jar[root.id !== undefined])
        throw new Error('Id appears twice: ' + root.id);
      jar[root.id] = root;
      root.id = undefined; // ids must be unique after we re-attach to the document
      root.write = write;
      root.showhide = showhide;
    }
    for (const child of root.children)
      collect(child, jar);
  }

  this.mkrig = mkrig;
})();
