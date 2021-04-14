export function handleNumbers(types: string[] | string): number[] {
  if (types) {
    if (Object.prototype.toString.call(types) === '[object String]') {
      return [Number(types)];
    } else if (types instanceof Array) {
      return types.map(value => Number(value));
    }
  } else {
    return [];
  }
}
