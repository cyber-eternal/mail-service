export const parseBoolean = (
  value: string | undefined,
  defaultValue: boolean = false,
) => {
  return value === 'true' || value === 'false'
    ? value === 'true'
    : defaultValue;
};
