const cases = [
    [2, 3],
    [2, 7],
    [7, 2],
    [2, 17],
    [3, 5],
    [5, 7],
    [6, 10, 15],
    [4, 6],
    [42, 70, 105],
    [101, 103],
    [201, 203],
    [301, 303],
    [30, 105, 42, 70],
    [2310/2, 2310/3, 2310/5, 2310/7, 2310/11],
    [2310/14, 2310/15, 2310/11],
    [14, 15],
    [14, 15, 16],
    [21, 24, 28],
    [33, 34, 35],
    [33, 35],
    [21, 34],
    [34, 55],
];

for (const seed of cases) {
    console.log( seed, ' -> ', inconstructible(...seed))
}

function inconstructible (...seed) {
    if (euclid(...seed) != 1)
        return Infinity;
    seed.sort((x, y) => x - y);
    let candidate = seed[0] - 1;
    const cache = new Set([0]);
    num: for (n = seed[0]-1;;n++) {
        if (n - candidate > seed[0]+1)
            return candidate;
        for (const i of seed) {
            if (cache.has(n - i)) {
                cache.add(n);
                continue num;
            };
        }
        candidate = n;
    }
}

function euclid (...seed) {
    while (seed.length > 1) {
        const next = seed.shift() % seed[0];
        if (next != 0)
            seed.push(next);
    }
    return seed[0];
};
