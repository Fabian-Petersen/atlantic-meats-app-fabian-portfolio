// $ This model is to open a modal from a button using ShadCN Dropdown and Dialog components

import { MoreVertical } from "lucide-react";
// import useGlobalContext from "@/context/useGlobalContext";
import type { TableMenuItemActions } from "@/lib/TableMenuItemsActions";
import type { GlobalData } from "@/schemas";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  //   DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// import type { AssetFormValues, CreateJobFormValues } from "@/schemas";
// import Separator from "../dashboardSidebar/Seperator";

type DropdownMenuDialogProps<GlobalData> = {
  data: GlobalData;
  menuItems: TableMenuItemActions[];
};

export function DropdownMenuButtonDialog({
  // data,
  menuItems,
}: DropdownMenuDialogProps<GlobalData>) {
  // const { setGenericData, setPendingTableAction } = useGlobalContext();
  // const rowId = data.id;
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            size="icon-sm"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-full hover:bg-muted outline-none hover:bg-primary/40 bg-transparent hover:cursor-pointer"
          >
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-36 bg-white border-gray-50 dark:bg-bgdark dark:text-gray-100 shadow-lg text-font p-1"
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
                  <div className="text-font text-xs px-1 flex gap-4 w-full justify-center items-center hover:cursor-pointer">
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
