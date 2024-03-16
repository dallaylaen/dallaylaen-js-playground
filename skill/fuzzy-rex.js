'use strict';

function fuzzy (str, fuzz) {
  return new RegExp('^(' + fuzzy_rec(str, fuzz) + ')$');
}

function fuzzy_rec (str, fuzz) {
  if (fuzz === 0)
    return exact(str);
  if (str.length === 0)
    return '.{0,' + fuzz + '}';

  const head = exact(str.substring(0, 1));
  const tail = str.substring(1);
  return one_of(
    head + fuzzy_rec(tail, fuzz),
    '[^' + head + ']?' + fuzzy_rec(tail, fuzz - 1),
    '.' + fuzzy_rec(str, fuzz -1),
  );
}

function exact (str) {
  return str.replace(/(\W)/g, '\\$1');
}

function one_of(...args) {
  return '(?:'+args.join('|')+')';
}

function mistake(sym) {
  return '(?:[^' + sym + ']?|' + sym + '.|.' + sym + ')';
}

module.exports = {fuzzy};
