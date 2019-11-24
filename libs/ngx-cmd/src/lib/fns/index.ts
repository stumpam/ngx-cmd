export const switchcase = (cases: any) => (defaultCase: any) => (key: any) =>
  cases.hasOwnProperty(key) ? cases[key] : defaultCase;

export const get = <T>(key: string, obj: T) => {
  const currentKey = key.split('.');

  const result = obj && obj[currentKey[0]];

  return currentKey.length > 1
    ? get(currentKey.slice(1).join('.'), result)
    : result;
};

export const omit = <T>(key: string, obj: T) => {
  const currentKey = key.split('.');

  if (currentKey.length > 1) {
    return omit(currentKey.slice(1).join('.'), obj[currentKey[0]]);
  }

  const { [currentKey[0] as keyof T]: omitted, ...rest } = obj;

  return rest || {};
};

export const set = <T>(key: string, obj: T, value: any) => {
  const currentKey = key.split('.');

  if (!obj[currentKey[0]]) obj[currentKey[0]] = {};

  if (currentKey.length > 1) {
    return set(currentKey.slice(1).join('.'), obj[currentKey[0]], value);
  }

  obj[currentKey[0]] = value;
};
