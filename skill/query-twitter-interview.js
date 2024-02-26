const data = [
  { id: 31, name: 'John', surname: 'Doe', age: 35},
  { id: 32, name: 'Jane', surname: 'Doe', age: 25},
  { id: 33, name: 'Sally', surname: 'Doe', age: 33},
  { id: 34, name: 'John', surname: 'Smith', age: 36},
];

const ids = query(
  where({ name: 'John' }),
  where({ surname: 'Doe' }),
  sort('age'),
)(data).map( rec => rec.id );

console.log(ids);

function query (...criteria) {
  let out = list => list;
  for (let fun of criteria) {
    const inner = out;
    out = list => fun(inner(list));
  }
  return out;
}

function where(fields) {
  return list => list.filter( item => {
    for (let prop in fields)
      if (item[prop] !== fields[prop])
        return false;
    return true;
  });
}
function sort(field) {
  return list => list.sort( sortBy( item => item.field ) );
}

function sortBy (xform) {
  return (x, y) => {
    const ix = xform(x);
    const iy = xform(y);
    if (ix < iy) return -1;
    if (iy < ix) return 1;
    return 0;
  }
}
