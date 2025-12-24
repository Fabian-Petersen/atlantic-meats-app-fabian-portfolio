// "use client";

// import { IconButton } from "@chakra-ui/react";
// import { Menu } from "lucide-react";

// type SidebarButtonProps = {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
// };

// const SidebarToggleButton = ({ isOpen, setIsOpen }: SidebarButtonProps) => {
//   return (
//     <IconButton
//       aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
//       variant="solid"
//       bgColor="transparent"
//       color={{ base: "gray.600", _dark: "blue.200" }}
//       _hover={{
//         bgColor: { base: "gray.200/70", _dark: "gray.500/40" },
//       }}
//       onClick={() => setIsOpen(true)}
//     >
//       {!isOpen && <Menu size={20} />}
//     </IconButton>
//   );
// };

// export default SidebarToggleButton;
