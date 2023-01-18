/**
 * https://leetcode.com/problems/longest-path-with-different-adjacent-characters/description/
 * @param {number[]} parent
 * @param {string} s
 * @return {number}
 */
const longestPath = function (parent, s) {
  const graph = parent.map( _ => []);
  for (let i = 1; i < parent.length; i++)
    graph[parent[i]].push(i);
  console.log(graph);

  // [return: root, path-to-root, path-inside]
  const dfs = function (v, depth) {
    const list = graph[v].map(x => dfs(x, depth + 1));
    let first = 0;
    let second = 0;
    let bestInside = 0;
    for (const [x, toRoot, inside] of list) {
      if (inside > bestInside)
        bestInside = inside;
      if (s[x] === s[v])
        continue;
      if (toRoot > first) {
        second = first;
        first = toRoot;
      } else if (toRoot > second ) {
        second = toRoot;
      }
    }
    console.log({
      node: { n: v, s: s[v], depth, children: graph[v]},
      found: list,
      output: { bestInside, first, second }
    });
    return [v, first + 1, Math.max(bestInside, first + second + 1), s[v]];
  }

  const ans = dfs(0, 1);
  // console.log({ans});
  return Math.max(ans[1], ans[2]);
};


const input = [-1,56,10,79,52,0,37,39,127,125,116,52,95,131,105,55,55,52,87,35,43,130,87,103,8,73,8,116,4,43,60,104,116,118,78,9,133,139,7,127,96,28,52,79,78,36,102,134,100,104,47,127,129,77,121,133,10,58,104,55,69,73,107,9,139,79,52,72,130,78,112,43,14,4,120,9,139,118,52,52,73,82,79,58,121,80,139,10,25,74,10,123,134,112,40,80,108,128,5,52,43,31,10,42,79,139,86,58,3,118,117,21,4,79,45,26,5,122,102,13,88,139,108,118,116,10,58,32,80,125,121,105,116,104,82,131,39,10,126,125]
const str = "vodpyvpjmogqvwnibqasbulkfbfugvtlpdtsmydrbrekavkhifoypepbcnzpmasbnlrfqgdhnmvhldsrogjsntummchcftzrnycichziopmphfqwqdsihoywdpqqkyvzrhbqorwrkmns"

console.log(longestPath(input, str));
