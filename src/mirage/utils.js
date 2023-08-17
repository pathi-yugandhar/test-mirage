export function filterTags(tagsCollection, filter: string) {
  const filterByKeyOrValue = filter.includes(' or ');
  let filterToSlice = filter;
  if (filterByKeyOrValue) {
    const arr = filter.split(' or ');
    // eslint-disable-next-line prefer-destructuring
    filterToSlice = arr[0];
  }
  // slice out word 'contains', filter tags
  const filterString = filterToSlice.slice(9, -1);
  const filterParams = filterString.split(',');
  const keyOrvalue = filterParams[0].replace(/["']/g, ''); // remove quotes
  const searchString = filterParams[1].replace(/["']/g, '');
  if (filterByKeyOrValue) {
    return tagsCollection.filter(tag => tag.key.includes(searchString.toLocaleLowerCase()) || tag.value.includes(searchString.toLocaleLowerCase()));
  }
  return tagsCollection.filter(tag => tag[keyOrvalue].includes(searchString));
}

export function selectProps(tagsArray, selector) {
  if (["key", "value"].indexOf(selector) === -1) {
    return tagsArray;
  }
  let tags = [];
  if (selector === "key") {
    tags = tagsArray.map((tag) => ({
      key: tag.key,
    }));
  }
  if (selector === "value") {
    tags = tagsArray.map((tag) => ({
      value: tag.value,
    }));
  }
  return tags;
}

export function sortTags(tagsArray, sortType) {
  if (sortType !== "key asc") {
    return tagsArray;
  }
  let tags;
  if (sortType === "key asc") {
    tags = tagsArray.sort((tag1, tag2) => {
      if (tag1.key > tag2.key) {
        return 1;
      }
      if (tag1.key < tag2.key) {
        return -1;
      }
      return 0;
    });
  }
  return tags;
}
