import { cn } from "@/lib/utils";

// $ Mobile Shared Styles
export const sharedStyles = {
  // $ Mobile Cards
  cardParent: cn("flex flex-col min-h-screen lg:hidden w-full bg-gray-50"),
  cardTopBar: cn(
    "rounded-md sticky top-0 z-10 bg-white dark:bg-primary_dark border border-gray-200 dark:border-gray-700/60 px-4 py-3 flex items-center justify-between gap-3",
  ),
  cardChild: cn(
    "mt-4 bg-white dark:bg-primary_dark rounded-md border border-gray-200 dark:border-gray-700/60 p-4 w-full",
  ),
  // $ Buttons
  btn: cn(),
  btnParent: cn("flex w-full md:max-w-1/2 ml-auto gap-2 md:w-72"), // container for the buttons
  btnCancel: cn(
    "flex-1 py-2 text-xs font-medium rounded-md border transition-colors",
    // light
    "bg-red-500/10 border-red-500/40 text-red-700",
    // dark
    "dark:bg-red-500/15 dark:border-red-500/25 dark:text-red-300",
    // hover
    "hover:bg-red-500/20 hover:border-red-500/60",
    "dark:hover:bg-red-500/22 dark:hover:border-red-500/40",
  ),
  btnApprove: cn(
    "flex-1 py-2 text-xs font-medium rounded-md border transition-colors",
    // light
    "bg-green-500/10 border-green-500/40 text-green-700",
    // dark
    "dark:bg-green-500/15 dark:border-green-500/25 dark:text-green-300",
    // hover
    "hover:bg-green-500/20 hover:border-green-500/60",
    "dark:hover:bg-green-500/22 dark:hover:border-green-500/40",
  ),
  btnView: cn(
    "flex-1 py-2 text-xs font-medium rounded-md border transition-colors",
    // light
    "bg-green-500/10 border-green-500/40 text-green-700",
    // dark
    "dark:bg-green-500/15 dark:border-green-500/25 dark:text-green-300",
    // hover
    "hover:bg-green-500/20 hover:border-green-500/60",
    "dark:hover:bg-green-500/22 dark:hover:border-green-500/40",
  ),
  btnSubmit: cn(
    // general
    "flex-1 py-2 text-xs font-medium rounded-md border transition-colors",
    // light
    "bg-[#fcb53b]/15 border-[#fcb53b]/50 text-[#a06b00]",
    // dark
    "dark:bg-[#fcb53b]/15 dark:border-[#fcb53b]/30 dark:text-[#fcb53b]",
    // hover
    "hover:bg-[#fcb53b]/25 hover:border-[#fcb53b]/70",
    "dark:hover:bg-[#fcb53b]/22 dark:hover:border-[#fcb53b]/45",
  ),
  btnReject: cn(
    "flex-1 py-2 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border dark:border-(--clr-borderDarkRed)",
  ),
  // $ headings:
  heading: cn("text-xl md:text-2xl capitalize w-full dark:text-gray-100"), // shared styles
  formHeading: cn("text-center md:text-left md:px-0"), // form headings
  TableHeading: cn("text-left p-4 md:py-0"), // table headings

  // $ Forms:
  form: cn(
    "flex flex-col rounded-lg lg:w-full text-(--clr-textLight) dark:bg-(--bg-primary_dark) bg-white",
  ),
  formParent: cn("grid grid-cols-1 lg:grid-cols-2 gap-4 w-full md:py-2"),

  // $ Tables
  table: cn("w-full lg:p-4 min-h-0 hidden lg:block"),
  tableParent: cn(),
  tableRows: cn(),
  tableHeaders: cn(),
};
