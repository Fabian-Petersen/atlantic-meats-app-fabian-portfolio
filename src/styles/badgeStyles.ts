// shared.ts
import { cn } from "@/lib/utils";
//  "border min-w-16 w-fit rounded-full max-w-fit py-[0.25rem] text-center px-[0.40rem]";
export const badgeStyles = {
  base: cn(
    "text-center min-w-12 max-w-fit",
    "px-[0.40rem] py-[0.135rem]",
    "rounded-full",
    "text-cxs",
    "border",
  ),

  // "border min-w-12 w-fit rounded-full max-w-fit p-[0.135rem] text-center px-[0.40rem]"

  fallback: cn(
    "bg-gray-100 text-gray-600 border-gray-200",
    "dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  ),

  families: {
    priority: {
      critical: cn(
        "bg-red-300/30 text-red-600 border-red-300",
        "dark:border-red-500 dark:bg-red-300/20 dark:text-red-300",
      ),

      high: cn(
        "text-orange-600 bg-orange-300/30 border-orange-300",
        "dark:border-orange-500 dark:bg-orange-300/20 dark:text-orange-300",
      ),

      medium: cn(
        "text-blue-600 bg-blue-300/30 border-blue-300",
        "dark:border-blue-500 dark:bg-blue-300/20 dark:text-blue-300",
      ),

      low: cn(
        "text-green-600 bg-green-300/30 border-green-300",
        "dark:border-green-500 dark:bg-green-300/20 dark:text-green-300",
      ),
    },

    impact: {
      compliance: cn(
        "bg-red-50 text-red-700 border-red-200",
        "dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
      ),

      production: cn(
        "bg-orange-50 text-orange-700 border-orange-200",
        "dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
      ),

      safety: cn(
        "bg-yellow-50 text-yellow-700 border-yellow-200",
        "dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
      ),
    },

    condition: {
      operational: cn(
        "text-green-600 bg-green-300/30 border-green-300",
        "dark:border-green-500 dark:bg-green-300/20 dark:text-green-300",
      ),

      "not operational": cn(
        "text-orange-600 bg-orange-300/30 border-orange-300",
        "dark:border-orange-500 dark:bg-orange-300/20 dark:text-orange-300",
      ),

      new: cn(
        "text-sky-600 bg-sky-300/30 border-sky-300",
        "dark:border-sky-500 dark:bg-sky-300/20 dark:text-sky-300",
      ),

      poor: cn(
        "text-orange-600 bg-orange-300/30 border-orange-300",
        "dark:border-orange-500 dark:bg-orange-300/20 dark:text-orange-300",
      ),

      broken: cn(
        "text-red-600 bg-red-300/30 border-red-300",
        "dark:border-red-500 dark:bg-red-300/20 dark:text-red-300",
      ),
    },
    type: {
      corrective: cn(
        "text-green-600 bg-green-300/30 border-green-300",
        "dark:border-green-500 dark:bg-green-300/20 dark:text-green-300",
      ),

      preventative: cn(
        "text-orange-600 bg-orange-300/30 border-orange-300",
        "dark:border-orange-500 dark:bg-orange-300/20 dark:text-orange-300",
      ),

      safety: cn(
        "text-blue-600 bg-blue-300/30 border-blue-300",
        "dark:border-blue-500 dark:bg-blue-300/20 dark:text-blue-300",
      ),
    },
    status: {
      complete: cn(
        "text-green-600 bg-green-300/30 border-green-300",
        "dark:border-green-500 dark:bg-green-300/20 dark:text-green-300",
      ),

      cancelled: cn(
        "text-orange-600 bg-orange-300/30 border-orange-300",
        "dark:border-orange-500 dark:bg-orange-300/20 dark:text-orange-300",
      ),

      "in progress": cn(
        "text-blue-600 bg-blue-300/30 border-blue-300",
        "dark:border-blue-500 dark:bg-blue-300/20 dark:text-blue-300",
      ),
    },
    verification: {
      verified: cn(
        "text-green-600 bg-green-300/30 border-green-300",
        "dark:border-green-500 dark:bg-green-300/20 dark:text-green-300",
      ),

      "due soon": cn(
        "text-orange-600 bg-orange-300/30 border-orange-300",
        "dark:border-orange-500 dark:bg-orange-300/20 dark:text-orange-300",
      ),

      pending: cn(
        "text-blue-600 bg-blue-300/30 border-blue-300",
        "dark:border-blue-500 dark:bg-blue-300/20 dark:text-blue-300",
      ),
      overdue: cn(
        "text-red-600 bg-red-300/30 border-red-300",
        "dark:border-red-500 dark:bg-red-300/20 dark:text-red-300",
      ),
      unverified: cn(
        "text-red-600 bg-red-300/30 border-red-300",
        "dark:border-red-500 dark:bg-red-300/20 dark:text-red-300",
      ),
      "not found": cn(
        "text-gray-800 bg-gray-800/30 border-gray-300",
        "dark:border-gray-500 dark:bg-gray-300/20 dark:text-gray-300",
      ),
    },
    business_unit: {
      retail: cn(
        "text-indigo-600 bg-indigo-300/30 border-indigo-300",
        "dark:border-indigo-500 dark:bg-indigo-300/20 dark:text-indigo-300",
      ),

      distribution: cn(
        "text-cyan-600 bg-cyan-300/30 border-cyan-300",
        "dark:border-cyan-500 dark:bg-cyan-300/20 dark:text-cyan-300",
      ),

      central_services: cn(
        "text-purple-600 bg-purple-300/30 border-purple-300",
        "dark:border-purple-500 dark:bg-purple-300/20 dark:text-purple-300",
      ),

      maintenance: cn(
        "text-amber-600 bg-amber-300/30 border-amber-300",
        "dark:border-amber-500 dark:bg-amber-300/20 dark:text-amber-300",
      ),
    },
  },
};
