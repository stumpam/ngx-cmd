export const switchcase = (cases: any) => (defaultCase: any) => (key: any) =>
  cases.hasOwnProperty(key) ? cases[key] : defaultCase;

export const get = <T>(key: string, obj: T) => {
  const currentKey = key.split('.');

  const result = obj && obj[key];

  return currentKey.length > 1
    ? get(currentKey.slice(1).join('.'), result)
    : result;
};
