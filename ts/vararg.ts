function foo<T extends any[], R>(...args: [...T, (result: R) => any]): any {
    const cb = args.pop();
    cb(args);
}

foo(console.log);

foo("args", console.log);

foo("other", "args", true, 12, console.log);


/*

type Skip = [string] | [];
type Optcall = [...Skip, (a: string)=>void];

declare function foo (...args): void;
function foo( ...args ) {
    const cb = args.pop();
    const input = args[0] ?? 'hello';
    cb( input );
}

foo("boom", console.log);

foo(console.log);

*/

