function numberOfArrays(s: string, k: number): number {
    const MOD: BigInt = 1_000_000_007n;

    const logk = (''+k).length;
    const cache = {};

    const rec = (s:string): BigInt => {
        if (s.length === 0)
            return 1n;
        if (s[0] === '0')
            return 0n;
        if (s.length === 1)
            return Number.parseInt(s) <= k ? 1n : 0n;

        if (cache[s] === undefined) {
            // console.log('calculate string', s);
            let acc : BigInt = 0n;
            const mid = s.length >> 1;
            for (let lo = mid-logk; lo <= mid; lo++) {
                if (lo < 0 || s[lo] === '0')
                    continue;
                for (let hi = mid+1; hi <= mid+logk && hi <= s.length; hi++) {
                    // if (hi - lo > logk)
                    //     continue;
                    if (s[hi] === '0')
                        continue;
                    if (Number.parseInt(s.substring(lo, hi)) > k)
                        continue;

                    console.log(
                        'split:', s, '=',
                        s.substring(0, lo),
                        s.substring(lo, hi),
                        s.substring(hi)
                        );

                    // acc += rec(s.substring(0, lo)) * rec(s.substring(hi));
                }
            }
            cache[s] = acc % MOD;
            console.log('rec('+s+') =', cache[s]);
        };
        return cache[s];
    }

    return Number(rec(s));
};