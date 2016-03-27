export function moveBefore(array, itemMatcherFn, siblingMatcherFn) {
  let removedItem = remove(array, itemMatcherFn);
  let nextIndex = array.findIndex(siblingMatcherFn);
  array.splice(nextIndex >= 0 ? nextIndex : array.length, 0, removedItem);
}

function remove(array, matcherFn) {
  let index = array.findIndex(matcherFn);
  if (index >= 0) {
    return array.splice(index, 1)[0];
  }
}