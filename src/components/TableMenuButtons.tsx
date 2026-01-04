import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
// import { useGlobalContext } from "@/app/contexts/useGlobalContext";
import type { ZodSchema } from "zod/v3";

type Props = {
  item: ZodSchema;
};

const TableMenuButtons = ({}: Props) => {
  // const {
  //   setIsUpdateProjectModalOpen,
  //   setSelectedProject,
  //   setIsDeleteModalOpen,
  //   setItemToDelete,
  //   setResourceTypeToDelete,
  // } = useGlobalContext();

  // const handleEditProject = (e: Event) => {
  //   e.stopPropagation();
  //   setIsUpdateProjectModalOpen(true);
  //   setSelectedProject(item);
  // };

  // const handleDeleteProject = (e: Event) => {
  //   e.stopPropagation();
  //   setItemToDelete(item);
  //   setResourceTypeToDelete("projects");
  //   setIsDeleteModalOpen(true);
  // };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-gray-500 dark:text-gray-300 outline-none"
        >
          <MoreVertical size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-32 bg-white dark:bg-[#222e44]"
      >
        <DropdownMenuItem
          // onSelect={handleEditProject}
          className="flex items-center gap-2 text-xs tracking-wider cursor-pointer"
        >
          <Pencil size={16} />
          <span>Edit</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          // onSelect={handleDeleteProject}
          className="flex items-center gap-2 text-xs tracking-wider text-orange-500 focus:text-red-600 cursor-pointer"
        >
          <Trash2 size={16} />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableMenuButtons;
