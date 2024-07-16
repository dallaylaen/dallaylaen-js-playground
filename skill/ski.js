/**
 * Combinatory logic simulator
 */

class Ast {
  constructor() {};
  combine(args) {
    if (args instanceof Ast)
      args = [args];
    return args.length > 0 ? new Call(this, args) : this;
  }
  eval() {return null};
  toString() {
    throw new Error( "toString() undefined for generic AST" );
  }
}

class Call extends Ast {
  /**
   *
   * @param {Ast} fun
   * @param {Ast[]} args
   */
  constructor (fun, args) {
    super();
    this.fun = fun;
    this.args = args;
  }

  combine(args) {
    if (args instanceof Ast)
      args = [args];
    if (args.length === 0)
      return this;
    return new Call(this.fun, [...this.args, ...args]);
  }

  eval() {
    // if subtrees changed, return new self
    let change = 0;
    const f = this.fun.eval();
    if (f) {
      change++;
      // console.log("change in function: "+this.fun + " => " + f);
    }

    const args = [];
    for (let x of this.args) {
      const next = x.eval();
      args.push(next ?? x);
      if (next) {
        change++;
        // console.log("change in arg: "+x+" => "+next);
      }
    }

    if (change)
      return (f ?? this.fun).combine(args);

    // if nothing has changed, but there's known combinator, reduce it
    if (this.fun instanceof Special && this.args.length >= this.fun.arity) {
      const args = [...this.args]; // shallow copy
      const enough = args.splice(0, this.fun.arity);
      const result = this.fun.impl(...enough)
      // console.log("eval: apply "+this.fun+" to "+enough.join(", ")+" => "+result);
      return result.combine(args);
    }

    // no change whatsoever
    return null;
  }

  toString () {
    return this.fun.toString() + this.args.map(x => "("+x+")").join("");
  }
}

class Value extends Ast {
  constructor (name) {
    super();
    this.name = name;
  }
  toString () {
    return this.name;
  }
}

class Special extends Value {
  constructor (name, arity, impl) {
    super(name);
    this.arity = arity;
    this.impl  = impl;
  }
}

class Empty extends Ast {
  combine(args) {
    if (args instanceof Ast)
      args = [args];
    return args.length ? args.shift().combine(args) : this;
  }
  toString () {
    return "<empty>";
  }
}

const known = {
  I: new Special("I", 1, x => x),
  K: new Special("K", 2, (x, _) => x),
  S: new Special("S", 3, (x, y, z) => x.combine(z).combine(y.combine(z))),
}

function ident (token) {
  return known[token] ?? new Value(token);
}

function parse (str) {
  const tokens = [...str.matchAll(/[SKI()]|[a-z]+/g)].map(x => x[0]);

  const empty = new Empty;
  const stack = [empty];

  for( let c of tokens) {
    // console.log("parse: found "+c+"; stack =", stack.join(", "));

    if (c === '(') {
      stack.push(empty);
    } else if( c === ')') {
      const x = stack.pop();
      const f = stack.pop();
      stack.push(f.combine([x]));
    } else {
      const f = stack.pop();
      const x = ident(c);
      // console.log("combine", f, x)
      stack.push(f.combine([x]));
    }
  }

  if (stack.length !== 1)
    throw new Error("unbalanced input: "+str);

  return stack[0];
}

let expr = parse(process.argv[2]);

// console.log(expr);

while (expr) {
  console.log(""+expr);
  expr = expr.eval();
}

