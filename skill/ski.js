/**
 * Combinatory logic simulator
 */

class Ast {
  constructor() {};
   apply(x) {
    return new Call(this, x);
  }
   eval() {return null};
   toString() {
    throw new Error( "toString() undefined for generic AST" );
  }
}

class Call extends Ast {
  constructor (fun, arg) {
    super();
    this.fun = fun;
    this.arg = arg;
  }

   eval() {
    const f = this.fun.eval();
    const x = this.arg.eval();
    return f && x ? new Call(f ?? this.fun, x ?? this.arg) : null;
  }

   toString () {
    return this.fun.toString()+"("+this.arg.toString()+")";
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

class I extends Ast {
   apply(x) {
    return x;
  }
   toString () {
    return "I";
  }
}

class K extends Ast {
   apply(x) {
    return new K1(x);
  }
   toString () {
    return "K";
  }
}

class K1 extends Ast {
  constructor (x) {
    super();
    this.x = x;
  }
   apply(unused) {
    return this.x;
  }
   toString () {
    return "K("+this.x.toString()+")";
  }
}

class S extends Ast {
   apply(x) {
    return new S1(x);
  }
   toString () {
    return "S";
  }
}

class S1 extends Ast {
  constructor (x) {
    super();
    this.x = x;
  }
   apply (y) {
    return new S2(this.x, y);
  }
   toString () {
    return "S("+this.x+")";
  }
}


class S2 extends S1 {
  constructor (x, y) {
    super(x);
    this.y = y;
  }
   apply(z) {
    return new Call(this.x, z).apply(new Call(this.y, z));
  }
   toString () {
    return super.toString() + "(" + this.y + ")";
  }
}

const known = {
  S: new S(),
  K: new K(),
  I: new I(),
}

function ident (token) {
  return known[token] ?? new Value(token);
}

function parse (str) {
  const tokens = [...str.matchAll(/[SKI]|[a-z]+|[()]/g)].map(x => x[0]);

  const empty = known.I;
  const stack = [empty];

  for( let c of tokens) {
    // console.log("parse: found "+c+"; stack = ", stack);

    if (c === '(') {
      stack.push(empty);
    } else if( c === ')') {
      const x = stack.pop();
      const f = stack.pop();
      stack.push(f.apply(x));
    } else {
      const f = stack.pop();
      const x = ident(c);
      stack.push(f.apply(x));
    }
  }

  if (stack.length !== 1)
    throw new Error("unbalanced input: "+str);

  return stack[0];
}

let expr = parse(process.argv[2]);

while (expr) {
  console.log(""+expr);
  expr = expr.eval();
}

