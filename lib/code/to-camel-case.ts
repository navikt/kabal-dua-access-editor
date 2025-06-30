/** Transforms uppercase strings to camel case.
 * @example "HELLO_WORLD" => "helloWorld"
 */
export const uppercaseToCamelCase = (str: string): string => {
  return str
    .replace(/[-_]+/g, ' ') // Replace hyphens and underscores with space
    .split(' ')
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase(); // First word in lowercase
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize first letter of subsequent words
    })
    .join('');
};
