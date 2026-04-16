import { cn } from "@/lib/utils";

// $ Mobile Shared Styles
export const sharedStyles = {
  // $ Pages
  pageContainer: cn("flex items-center justify-center w-full h-full p-4"),
  pageContent: cn(
    "bg-white flex flex-col gap-4 w-full lg:max-w-3xl h-auto rounded-xl shadow-lg p-4 dark:bg-(--bg-primary_dark) dark:text-(--clr-textDark) dark:border-gray-700/50 dark:border",
  ),
  // $ Mobile Cards
  cardParent: cn("flex flex-col min-h-screen lg:hidden w-full bg-gray-50"),
  cardTopBar: cn(
    "rounded-md sticky top-0 z-10 bg-white dark:bg-primary_dark border border-gray-200 dark:border-gray-700/60 px-4 py-3 flex items-center justify-between gap-3",
  ),
  cardChild: cn(
    "mt-4 bg-white dark:bg-primary_dark rounded-md border border-gray-200 dark:border-gray-700/60 p-4 w-full",
  ),
  // $ Buttons
  btnParent: cn("flex w-full md:max-w-1/2 ml-auto gap-2 md:w-72"), // container for the buttons
  btn: cn(
    // General Styles shared by all
    "flex-1 py-2 text-xs font-medium border rounded-md transition-colors",
    // hover
    "hover:cursor-pointer",
  ), // button general styles
  btnCancel: cn(
    "",
    // light
    "bg-orange-500/10 border-orange-500/40 text-orange-700",
    // dark
    "dark:bg-orange-500/15 dark:border-orange-500/25 dark:text-orange-300",
    // hover
    "hover:bg-orange-500/20 hover:border-orange-500/60",
    "dark:hover:bg-orange-500/22 dark:hover:border-orange-500/40",
  ),
  btnApprove: cn(
    "flex-1",
    // light
    "bg-green-500/10 border-green-500/40 text-green-700",
    // dark
    "dark:bg-green-500/15 dark:border-green-500/25 dark:text-green-300",
    // hover
    "hover:bg-green-500/20 hover:border-green-500/60",
    "dark:hover:bg-green-500/22 dark:hover:border-green-500/40",
  ),
  btnView: cn(
    "flex-1",
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
    "flex-1",
    // light
    "bg-[#fcb53b]/15 border-[#fcb53b]/50 text-[#a06b00]",
    // dark
    "dark:bg-[#fcb53b]/15 dark:border-[#fcb53b]/30 dark:text-[#fcb53b]",
    // hover
    "hover:bg-[#fcb53b]/25 hover:border-[#fcb53b]/70",
    "dark:hover:bg-[#fcb53b]/22 dark:hover:border-[#fcb53b]/45",
  ),
  btnDelete: cn(
    "flex-1",
    // light
    "bg-red-500/10 border-red-500/40 text-red-700",
    // dark
    "dark:bg-red-500/15 dark:border-red-500/30 dark:text-red-300",
    // hover
    "hover:bg-red-500/20 hover:border-red-500/60",
    "dark:hover:bg-red-500/22 dark:hover:border-red-500/40",
  ),
  // $ headings:
  heading: cn("text-xl md:text-2xl capitalize w-full dark:text-gray-100"), // shared styles
  headingForm: cn("text-center md:text-left md:px-0"), // form headings
  headingTable: cn("text-left p-4 md:py-0"), // table headings

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

  // $ Modals
  modal: cn(
    // Sizing
    "max-w-80 md:max-w-lg",
    // Layout
    "flex flex-col",
    // Appearance
    "p-4 bg-white  rounded-lg",
    //light
    " bg-white text-(--clr-textLight)",
    // Dark
    "dark:bg-(--bg-secondary_dark) border-none dark:border-(--clr-borderDark) dark:text-(--clr-textDark)",
  ),
  modalLarge: cn(
    // Position (below Navbar)
    "max-h-[calc(100vh-var(--sm-navbarHeight)-2rem)]",
    // Sizing
    "max-w-80 md:max-w-lg",
    // Layout
    "flex flex-col",
    // Appearance
    "p-4 bg-white rounded-lg overflow-hidden",
    //light
    " bg-white text-(--clr-textLight)",
    // Dark
    "dark:bg-(--bg-secondary_dark) border-none dark:border-(--clr-borderDark) dark:text-(--clr-textDark)",
    "overflow-y-auto",
  ),
  modalForm: cn("flex flex-col items-center justify-center px-2"), // form housing the content
  modalParent: cn("flex flex-col gap-4 w-full rounded-lg"), // Parent of the outermost div
  modalBtnParent: cn("mt-4"),
  modalOverlay: cn("bg-black/60 dark:bg-black/30 backdrop-blur-xs"),
};
