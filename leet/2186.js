/**
 * @param {string} s
 * @param {string} t
 * @return {number}
 */
var minSteps = function (s, t) {
  const count = {};


  for (let i = 0; i < t.length; i++)
    count[t[i]] = (count[t[i]] ?? 0) - 1;
  console.log(count);

  for (let i = 0; i < s.length; i++)
    count[s[i]] = (count[s[i]] ?? 0) + 1;

  console.log(count);
  return Object.values(count).reduce((acc, val) => acc + Math.abs(val), 0);
};

console.log(minSteps("cotxazilut", "nahrrmcchxwrieqqdwdpneitkxgnt"));
