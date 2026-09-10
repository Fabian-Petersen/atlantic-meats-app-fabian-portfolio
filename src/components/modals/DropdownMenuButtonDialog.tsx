// $ This model is to open a modal from a button using ShadCN Dropdown and Dialog components

import { MoreVertical } from "lucide-react";
import {
  tableActionStyles,
  type TableActionLinks,
} from "@/lib/getTableMenuItems";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DropdownMenuDialogProps = {
  menuItems: TableActionLinks[];
};

export function DropdownMenuButtonDialog({
  menuItems,
}: DropdownMenuDialogProps) {
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open row actions"
            size="icon-sm"
            onClick={(e) => e.stopPropagation()}
            className="rounded-full border-0 bg-transparent p-2 text-slate-600 shadow-none transition-none hover:cursor-pointer hover:bg-primary/20 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-primary/60 dark:text-slate-300 dark:hover:bg-primary/20 dark:hover:text-white"
          >
            <MoreVertical className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-52 max-w-[calc(100vw-2rem)] rounded-xl border-slate-200 bg-white p-0 shadow-xl dark:border-(--clr-borderDark) dark:bg-(--bg-secondary_dark) dark:text-gray-100"
          align="end"
          sideOffset={8}
        >
          <DropdownMenuLabel className="rounded-t-[inherit] border-b border-slate-200 bg-gray-100 px-4.5 py-3 text-xs font-semibold tracking-wide text-slate-600 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200">
            Item Actions
          </DropdownMenuLabel>
          <DropdownMenuGroup className="space-y-1 p-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const actionStyle = tableActionStyles[item.id];
              return (
                <DropdownMenuItem
                  key={item.id}
                  className="min-h-10 cursor-pointer rounded-lg px-1 py-2 text-slate-700 focus:bg-primary/15 focus:text-slate-900 dark:text-slate-200 dark:focus:bg-primary/20 dark:focus:text-white"
                  onClick={item.onClick}
                >
                  <div className="flex w-full items-center gap-2 text-sm font-medium">
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg p-1.5",
                        item.bgColor ??
                          actionStyle?.bgColor ??
                          "bg-slate-100 dark:bg-slate-800",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4",
                          item.color ??
                            actionStyle?.color ??
                            "text-slate-500 dark:text-slate-400",
                        )}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="min-w-0 flex-1 wrap-break-word text-xs">
                      {item.label}
                    </span>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
