


function sum(list: Array<number>) {
    let total = 0;
    for (const n of list)
        total += n;
    return total; 
}

((foo: number) => foo + 1)(42);


console.log(sum(["foo", 2, 4, 7]));

