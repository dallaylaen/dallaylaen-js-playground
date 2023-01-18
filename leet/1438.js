/**
 * https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/
 * @param {number[]} nums
 * @param {number} limit
 * @return {number}
 */
var longestSubarray = function(nums, limit, spread=1) {
  // divide and conquer, recursively
  // assume mid element is within the subarray.
  // if not, split in half
  console.log('enter', 'len =', nums.length, 'best =', spread);
  if (nums.length <= spread)
    return spread;
  const mid = nums.length >> 1;
  const midVal = nums[mid];

  console.log('working on', nums.slice(0,mid), {mid, midVal}, nums.slice(mid+1));

  // move left from mid as far as possible, than go right
  // cutting the tail as we advance
  // Should be O(n)
  // tail is getting wider as we go left from mid
  let min = midVal, max = midVal;
  const tail = [[min, max]];
  let lo = 0;
  for (let i = mid; i-->0; ) {
    min = Math.min(min, nums[i]);
    max = Math.max(max, nums[i]);
    if (max - min > limit) {
      lo = i+1;
      break;
    }
    tail[mid - i] = [min, max];
  };

  console.log('leftmost index (lo) =', lo, tail[mid-lo]);

  // how far to the right of mid we can go
  // hithout falling out of bounds to what's left of mid?
  min = midVal, max = midVal;
  for (let hi = mid; ++hi < nums.length; ) {
    min = Math.min(min, nums[hi]);
    max = Math.max(max, nums[hi]);
    if (max - min > limit) {
      break;
    }
    while (max - tail[mid-lo][0] > limit || tail[mid-lo][1] - min > limit)
      lo++;
    spread = Math.max(spread, hi - lo + 1);
    console.log('step right:', {lo, hi, min, max, spread}, 'range on the left now =', tail[mid-lo]);
  }

  console.log({spread, best: spread});

  // recurse
  return Math.max(
    spread,
    longestSubarray(nums.slice(0, mid), limit, spread),
    longestSubarray(nums.slice(mid+1), limit, spread),
  )
};

const input = [
    7,40,10,10,40,39,96,21,54,73,
   33,17, 2,72, 5,76,28,73,59,22,
  100,91,80,66, 5,49,26,45,13,27,
   74,87,56,76,25,64,14,86,50,38,
   65,64, 3,42,79,52,37, 3,21,26,
   42,73,18,44,55,28,35,87
];




console.log(longestSubarray([5,2], 6));

function naive(nums, limit) {
  let best = 1;
  let where = [0,0];
  for (let lo = 0; lo < nums.length; lo++) {
    let min = nums[lo], max = nums[lo];
    for (let hi = lo+1; hi < nums.length; hi++) {
      min = Math.min(nums[hi], min);
      max = Math.max(nums[hi], max);
      if (max - min < limit)
        continue;
      if (hi - lo > best) {
        best = hi - lo;
        where = [lo, hi];
      };
      break;
    }
  }
  return [where[0], where[1], nums.slice(where[0], where[1])];
}
