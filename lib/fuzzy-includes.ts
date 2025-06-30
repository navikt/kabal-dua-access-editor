export const fuzzyIncludes = (value: string, filter: string) => {
  const lowerValue = value.toLowerCase().split('');
  const lowerFilter = filter.toLowerCase().split('');

  for (const char of lowerFilter) {
    const index = lowerValue.indexOf(char);

    if (index === -1) {
      return false;
    }

    lowerValue.splice(index, 1); // Remove the matched character to allow for fuzzy matching
  }

  return true;
};
