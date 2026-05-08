const generalStyles =
  "text-gray-400 bg-gray-100 border border-gray-500 border min-w-16 w-fit rounded-full max-w-fit py-[0.25rem] text-center px-[0.40rem]";

export const conditionClasses: Record<string, string> = {
  operational: `text-green-600 bg-green-300/30 border-green-300 dark:border-green-500 dark:bg-green-300/20 dark:text-green-300 ${generalStyles}`,
  "not operational": `text-orange-600 bg-orange-300/30 border-orange-300  dark:border-orange-500 dark:bg-orange-300/20 dark:text-orange-300 ${generalStyles}`,
  new: `text-blue-600 bg-blue-300/30 border-blue-300 dark:border-blue-500 dark:bg-blue-300/20 dark:text-blue-300 ${generalStyles}`,
  poor: `text-orange-600 bg-orange-300/30 border-orange-300  dark:border-orange-500 dark:bg-orange-300/20 dark:text-orange-300 ${generalStyles}`,
  broken: `text-red-600 bg-red-300/30 border-red-300 dark:border-red-500 dark:bg-red-300/20 dark:text-red-300 ${generalStyles}`,
  default: `text-gray-400 bg-gray-100 border border-gray-500 ${generalStyles}`,
};
