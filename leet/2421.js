/**
 * https://leetcode.com/problems/number-of-good-paths/description/
 * @param {number[]} vals
 * @param {number[][]} edges
 * @return {number}
 */
var numberOfGoodPaths = function(vals, edges) {

  const t0 = new Date();
  if (edges.length === 0)
    return vals.length;
  const graph = vals.map( (x, i) => {
    return {
      id: i, val: x, neib: new Set(),
      label: function() { return this.id+'('+this.val+')'},
      toString: function() {
        return this.label()+ ' [' + [...this.neib||[]].map(x=>x.label()).join(', ')+']'
      },
    }
  } );
  for (let [u, v] of edges) {
    graph[u].neib.add(graph[v]);
    graph[v].neib.add(graph[u]);
  }

  graph.sort((x,y) => x.val - y.val);
  console.log(graph.map(x => ''+x));

  console.log('sorted in', new Date()-t0);
  let sum = 0;

  for (let least of graph) {
    if (!least.neib)
      continue;
    console.log('working on '+least);
    const queue = [least];
    let count = 1;
    const toConnect = new Set();
    while (queue.length) {
      const rm = queue.pop();
      for (let next of rm.neib) {
        next.neib.delete(rm);
        if (next.val === least.val) {
          count++;
          queue.push(next);
          continue;
        }
        toConnect.add(next);
      }
      delete rm.neib;
    }

    const listify = [...toConnect];
    listify.sort((x,y) => x.val - y.val);
    for (let i = 1; i<listify.length; i++) {
      listify[i - 1].neib.add(listify[i]);
      listify[i].neib.add(listify[i - 1]);
    }

    sum += count * (count+1) / 2;

    console.log('sum now', sum);
    // console.log('node '+least.id+'('+least.val+')', 'in', new Date() - t0);
    console.log('graph now', graph.filter(x=>x.neib).map(x => ''+x));
  }

  return sum;
};

console.log(numberOfGoodPaths(
  [5,1,4,2,1,5,4,3],
  [[1,0],[2,0],[3,2],[4,2],[5,4],[6,4],[6,7]]
));

/*
console.log(numberOfGoodPaths(
  [2,5,5,1,5,2,3,5,1,5],
  [[0,1],[2,1],[3,2],[3,4],[3,5],[5,6],[1,7],[8,4],[9,7]]
));
*/
