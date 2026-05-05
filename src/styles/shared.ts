import { cn } from "@/lib/utils";

// $ Mobile Shared Styles
export const sharedStyles = {
  /* //$ ——— Pages ———————————————————————————————————————————————————————— */
  appLayout: cn(
    "min-h-screen w-full grid grid-cols-1 lg:grid-rows-[var(--lg-navbarHeight)_1fr] lg:grid-cols-[15rem_1fr] grid-rows-[var(--sm-navbarHeight)_1fr] bg-(--pageLight) dark:bg-(--pageDark)",
  ),
  pageContainer: cn(
    "flex items-center justify-center w-full h-full p-2 h-[calc(h-screen - var(--lg-navbarHeight)]",
  ),
  pageContent: cn(
    "bg-(--pageLight) flex flex-col gap-4 w-full lg:max-w-3xl h-auto rounded-xl shadow-lg p-4 dark:bg-(--bg-primary_dark) dark:text-(--clr-textDark) dark:border-gray-700/50 dark:border border border-gray-200/70",
  ),
  /* //$ ——— Modal Cards ———————————————————————————————————————————————————————— */
  cardParent: cn(
    "flex flex-col min-h-screen lg:hidden w-full",
    // light
    "",
    //dark
    "",
  ),
  cardTopBar: cn(
    "rounded-md sticky top-0 z-10 bg-white dark:bg-primary_dark border border-gray-200 dark:border-gray-700/60 px-4 py-3 flex items-center justify-between gap-3",
  ),
  cardRowParent: cn(
    "mt-4 rounded-md border border-gray-200  p-4 w-full",
    // light
    "bg-white",
    // dark
    "dark:bg-(--bg-primary_dark) dark:border-gray-700/60",
  ),
  cardRow: cn(
    "flex gap-3 py-3 items-center",
    // light
    "",
    // dark
    "",
  ),
  /* //$ ——— Buttons ———————————————————————————————————————————————————————— */
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
    "bg-orange-500/15 border-orange-500/40 text-orange-700",
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
    "bg-green-500/10 border-green-500/40 text-green-700",
    // dark
    "dark:bg-green-500/15 dark:border-green-500/25 dark:text-green-300",
    // hover
    "hover:bg-green-500/20 hover:border-green-500/60",
    "dark:hover:bg-green-500/22 dark:hover:border-green-500/40",
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
  /* //$ ——— Badge ———————————————————————————————————————————————————————— */
  badge: cn(),

  /* //$ ——— Headings ———————————————————————————————————————————————————————— */
  heading: cn("text-xl md:text-2xl capitalize w-full dark:text-gray-100"), // shared styles
  headingForm: cn("text-center md:text-left md:px-0"), // form headings
  headingTable: cn("text-left p-4 md:py-0"), // table headings

  /* //$ ——— Forms ——————————————————————————————————————————————————————————— */
  form: cn(
    "flex flex-col rounded-lg md:w-full text-(--clr-textLight) dark:bg-(--bg-primary_dark)",
  ),
  formParent: cn("grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:py-2"),

  formInputDefault: cn(
    // layout & sizing
    "text-xs py-3 px-2 w-full rounded-md outline-none",

    // base border & text (light)
    "border border-gray-300 text-gray-700",

    // dark mode base
    "dark:bg-(--bg-secondary_dark) dark:border-(--clr-borderDark) dark:text-(--clr-textDark)",

    // focus styles (shared)
    "focus:ring-0.5 focus:border-blue-500 focus:dark:border-blue-500",
  ),

  formInput: cn(
    "peer",
    // input-specific
    "placeholder-transparent placeholder:text-xs placeholder:dark:text-gray-700",
    // input-specific focus tweaks
    "focus:dark:bg-gray-700/80",
  ),
  //
  formSelect: cn(
    // peer was removed
    "peer capitalize",
    // select-specific tweaks
    "focus:dark:bg-gray-800/80",
  ),

  formTextArea: cn(
    "peer resize-none overflow-hidden",
    // textarea-specific tweaks
    "focus:border-rose-600 focus:dark:bg-gray-700/80",
  ),
  formFile: cn(""),
  formLabel: cn(
    // general
    "text-xs tracking-wider placeholder-transparent",
    //position
    "absolute -top-5 left-0 px-2 mb-0 transition-all duration-400",
    //peer
    "peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-600 peer-focus:-top-5  peer-focus:text-gray-600 peer-focus:text-sm",
    //light
    "text-gray-700",
    //dark
    "dark:peer-focus:text-gray-100 dark:peer-placeholder-shown:text-fontLight dark:text-gray-100/90",
  ),
  formError: cn("text-xs text-red-600 dark:text-red-500"),
  formSelectChevron: cn(
    "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 dark:text-(--clr-textDark) text-(--clr-textLight)",
  ),

  /* //$ ——— Tables ——————————————————————————————————————————————————————————— */
  table: cn("w-full lg:p-4 min-h-0 hidden md:flex flex-col gap-4"),
  tableParent: cn(),
  tableRows: cn(),
  tableHeaders: cn(),

  /* //$ ——— Modals ——————————————————————————————————————————————————————————— */
  modal: cn(
    // Sizing
    "w-full md:max-w-lg",
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
  modalParent: cn("flex flex-col gap-2 md:gap-4 w-full rounded-lg"), // Parent of the outermost div
  modalBtnParent: cn("mt-4"),
  modalOverlay: cn("bg-black/60 dark:bg-black/30 backdrop-blur-xs"),

  /* //$ ——— Sidebars ——————————————————————————————————————————————————————————— */
  sidebarOverlay: cn("fixed inset-0 z-900 bg-black/5"),
  sidebar: cn(
    "z-50 w-(--sidebarWidth) fixed",
    "overflow-auto no-scrollbar",
    "border-r border-r-gray-200 dark:border-r-gray-700",
    "bg-white dark:bg-(--bg-primary_dark)",
    // height
    "h-(--sm-sidebarHeight) md:h-(--lg-sidebarHeight)",
    // position from top
    "top-(--sm-navbarHeight) md:top-(--lg-navbarHeight)",
  ),
  sidebarChat: cn(
    // Layout (chat-specific)
    "right-0 w-80 lg:w-96",
    "overflow-y-scroll custom-scrollbar",

    // Appearance (only what differs from sidebarMain)
    "border-l border-l-gray-200",
    "dark:border-l-[rgba(55,65,81,0.5)]",
  ),
  sidebarNotification: cn(
    "right-0 w-80 lg:w-96",
    "overflow-y-scroll custom-scrollbar",
    "border-l border-l-gray-200",
    "dark:border-l-[rgba(55,65,81,0.5)]",
  ),

  sidebarMobile: cn("md:hidden"),
  sidebarDesktop: cn("hidden md:block"),
  /* //$ ——— Success & Error Modals ——————————————————————————————————————————————————————————— */
  actionModalParent: cn(
    "fixed z-2000 h-screen top-0 left-0 w-full flex items-center justify-center px-4 bg-black/50 outline-0 border-0",
  ),
  actionModalContent: cn(
    "flex flex-col items-center justify-center gap-8 w-full max-w-md rounded-2xl h-80 md:h-90 dark:border-[rgba(55,65,81,0.5)] border border-gray-100 dark:bg-(--bg-primary_dark) bg-white p-4 text-center shadow-sm",
  ),
  actionModalTitle: cn(
    "mb-2 text-2xl tracking-wide font-semibold text-(--clr-textLight) dark:text-(--clr-textDark)",
  ),
  actionModalMessage: cn(
    "mb-2 md:mb-4 text-sm md:text-md tracking-wide text-(--clr-textLight) dark:text-(--clr-textDark)",
  ),
  /* //$ ——— Charts ——————————————————————————————————————————————————————————— */
  chartParent: cn(
    "col-span-2 h-[300px] rounded-md bg-white dark:bg-(--bg-primary_dark)",
    "border border-white dark:border-gray-700/50 p-2 shadow-sm",
  ),
  chartHeading: cn(
    "font-normal dark:text-(--clr-textDark) text-(--clr-textLight)",
  ),
  chartTable: cn(
    "flex flex-col gap-4 col-span-full lg:col-span-full xl:col-span-full self-start w-full min-w-0 h-full overflow-y-auto rounded-md bg-white dark:bg-(--bg-primary_dark) border border-white dark:border-gray-700/50 p-4 shadow-sm",
  ),
};
