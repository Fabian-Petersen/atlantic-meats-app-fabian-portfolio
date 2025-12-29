// $ This function takes a string input and capitalise the first letter in JS.
// $ Used outside a component JSX e.g. inside a toast decription

export const capitalize = (value?: string): string => {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
};
