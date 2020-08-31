export function moveBefore (array, itemMatcherFn, siblingMatcherFn) {
  const removedItem = remove(array, itemMatcherFn)
  const nextIndex = array.findIndex(siblingMatcherFn)
  array.splice(nextIndex >= 0 ? nextIndex : array.length, 0, removedItem)
}

function remove (array, matcherFn) {
  const index = array.findIndex(matcherFn)
  if (index >= 0) {
    return array.splice(index, 1)[0]
  }
}
