import { Univariate} from "stats-logscale";

const stats = new Univariate();

for (let i = 1; i <= 100; i++)
    stats.add( i );

console.log(stats.percentile(50));
