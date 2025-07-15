export const isStringInputEmpty = (value: string | undefined): boolean => {
  return value === undefined || value.trim() === '';
};
