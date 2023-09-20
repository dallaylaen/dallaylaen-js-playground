#!/usr/bin/env node

const pattern = new RegExp(process.argv[2]);

byline(process.stdin, "\n",
    s => s.match(pattern) && process.stdout.write(s+"\n")
);

/**
 *
 * @param {Stream} input
 * @param {string} sep
 * @param {(s: string, isLast: boolean) => void} cb
 */
function byline(input, sep, cb) {
  let buf = '';
  input.on("end", () => cb(buf, true));
  input.on("data", chunk => {
    const list = (buf + chunk).split(sep);
    buf = list.pop();
    list.forEach(s => cb(s, false));
  });
}

