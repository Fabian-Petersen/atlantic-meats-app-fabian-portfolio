// $ This model is to open a modal from a button using ShadCN Dropdown and Dialog components

import { MoreVertical } from "lucide-react";
import { getMaintenanceTableMenuItems } from "@/data/TableMenuItems";
import useGlobalContext from "@/context/useGlobalContext";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  //   DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CreateJobFormValues } from "@/schemas";
// import Separator from "../dashboardSidebar/Seperator";

type DropdownMenuDialogProps = {
  data: CreateJobFormValues;
};

export function DropdownMenuButtonDialog({ data }: DropdownMenuDialogProps) {
  const {
    setShowUpdateDialog,
    setShowActionDialog,
    setShowDeleteDialog,
    setData,
  } = useGlobalContext();

  const menuItems = getMaintenanceTableMenuItems(
    setShowUpdateDialog,
    setShowActionDialog,
    setShowDeleteDialog
  );

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            size="icon-sm"
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded-md hover:bg-muted outline-none bg-transparent hover:cursor-pointer"
          >
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-40 bg-gray-100 border-0 text-font py-4 px-1"
          align="end"
        >
          {/* <DropdownMenuLabel className="text-sm">Action</DropdownMenuLabel> */}
          <DropdownMenuGroup className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <DropdownMenuItem
                  key={item.id}
                  className="hover:cursor-pointer text-font flex justify-between"
                  onSelect={() => {
                    console.log(`Selected action: ${item.action}`);
                    setData(data);
                    item.action(true);
                  }}
                >
                  <span>{item.name}</span>
                  <span className="flex items-center">
                    <Icon />
                  </span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
