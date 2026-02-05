export const checkIsEmptyOrSpaces = (str: string) => {
  return str === null || str.match(/^ *$/) !== null;
};
