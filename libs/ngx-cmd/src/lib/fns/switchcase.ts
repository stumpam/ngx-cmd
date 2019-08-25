export const switchcase = (cases: any) => (defaultCase: any) => (key: any) =>
  cases.hasOwnProperty(key) ? cases[key] : defaultCase;
