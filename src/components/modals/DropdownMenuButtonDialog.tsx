// $ This model is to open a modal from a button using ShadCN Dropdown and Dialog components

import { MoreVertical } from "lucide-react";
import useGlobalContext from "@/context/useGlobalContext";
import type { TableMenuProps } from "@/data/TableMenuItems";
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
  menuStateActions: TableMenuProps[];
};

export function DropdownMenuButtonDialog({
  data,
  menuStateActions,
}: DropdownMenuDialogProps<GlobalData>) {
  const { setGenericData, setPendingTableAction } = useGlobalContext();

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            size="icon-sm"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-full hover:bg-muted outline-none hover:bg-gray-100 bg-transparent hover:cursor-pointer"
          >
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-24 bg-white dark:bg-bgdark dark:text-gray-100 shadow-md border-0 text-font p-2"
          align="end"
        >
          {/* <DropdownMenuLabel className="text-sm">Action</DropdownMenuLabel> */}
          <DropdownMenuGroup className="space-y-2">
            {menuStateActions.map((item) => {
              const Icon = item.icon;
              return (
                <DropdownMenuItem
                  key={item.id}
                  className=""
                  onSelect={() => {
                    // console.log(`Selected action: ${item.action}`);
                    setGenericData(data);
                    setPendingTableAction({
                      id: data.id ?? "",
                      action: item.action,
                    });
                    item.openModal(true);
                  }}
                >
                  <div className="text-font text-xs flex w-full justify-center items-center hover:cursor-pointer">
                    <span className="flex-1 h-full">{item.name}</span>
                    <span className="flex-1 flex justify-end h-full p-0">
                      <Icon />
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
