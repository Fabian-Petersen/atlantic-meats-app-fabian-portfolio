// $ This model is to open a modal from a button using ShadCN Dropdown and Dialog components

import { MoreVertical } from "lucide-react";
import type { TableActionLinks } from "@/lib/getTableMenuItems";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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
            aria-label="Open menu"
            size="icon-sm"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-full hover:bg-muted outline-none hover:bg-primary/40 bg-transparent hover:cursor-pointer text-(--clr-textLight) dark:text-(--clr-textDark)"
          >
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-36 bg-white border-gray-50 dark:border-border-dark/20 dark:bg-(--bg-secondary_dark) dark:text-gray-100 shadow-lg px-1 py-2"
          align="end"
        >
          {/* <DropdownMenuLabel className="text-sm">Action</DropdownMenuLabel> */}
          <DropdownMenuGroup className="space-y-2 border-none">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <DropdownMenuItem
                  key={item.id}
                  className="py-1.5"
                  onClick={item.onClick}
                >
                  <div className="text-(--clr-textLight) dark:text-(--clr-textDark) text-xs px-1 flex gap-4 w-full justify-center items-center hover:cursor-pointer">
                    <span className="flex h-full p-0">
                      <Icon />
                    </span>
                    <span className="flex-1 h-full">{item.label}</span>
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
