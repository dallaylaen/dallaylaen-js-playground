
fork();

function fork(prefix=[]) {
  console.log(prefix.join(' ') || 'start');
  if (prefix.length >= 4)
    return;
  setTimeout(() => fork([...prefix, 'timeout']), 0);
  Promise.resolve(prefix).then(list => fork([...list, 'promise']));
}

