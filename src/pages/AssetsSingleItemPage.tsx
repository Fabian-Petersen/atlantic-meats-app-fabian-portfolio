// $ This page renders the full details of a maintenance request information with the supporting pictures

import { useParams } from "react-router-dom";
// import { useMaintenanceRequestById } from "../utils/maintenanceRequests";
import { PageLoadingSpinner } from "@/components/features/PageLoadingSpinner";
import { useById } from "@/utils/maintenanceRequests";
import { AssetSingleItemImages } from "@/components/assets/AssetSingleItemImages";

import type { AssetFormValues } from "@/schemas";

import AssetSingleItemInfo from "@/components/assets/AssetSingleItemInfo";

const ASSETS_KEY = ["assets"];

const AssetsSingleItemPage = () => {
  const { id } = useParams<{ id: string }>();

  //   const { data: item, isLoading } = useMaintenanceRequestById(id || "");
  // id "Testing from mobile: 4e9a8b44-f9e2-4fc0-ad8e-640fd23c7211"

  const { data: item, isPending } = useById<AssetFormValues>({
    id: id || "",
    queryKey: ASSETS_KEY,
    endpoint: "/asset",
  });

  // console.log(item);

  if (!id || !item) {
    return <PageLoadingSpinner />;
  }

  if (isPending) {
    return <PageLoadingSpinner />;
  }

  return (
    <div className="dark:text-gray-800 text-gray-100 p-4 grid md:grid-cols-2 h-full gap-2">
      <AssetSingleItemImages item={item} />
      <div className="bg-white dark:bg-[#1d2739] rounded-md border-gray-700/70">
        <AssetSingleItemInfo item={item} />
      </div>
    </div>
  );
};

export default AssetsSingleItemPage;
// <ul className="flex flex-col gap-4">
//       {data.map((item) => (
//         <li key={item.name} className="w-full">
//           <Link to={item.url}>
//             <SidebarNavItem
//               icon={item.icon}
//               url={item.url}
//               isActive={activeItem === item.name}
//               onClick={() => handleSidebarLinkClick(item.name)}
//             >
//               {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
//             </SidebarNavItem>
//           </Link>
//         </li>
//       ))}
//     </ul>
