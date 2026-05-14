import { getUserGroups } from "@/auth/getUserGroups";
import { useEffect } from "react";
const AssetHistoryPage = () => {
  useEffect(() => {
    const loadGroups = async () => {
      await getUserGroups();
    };
    loadGroups();
  }, []);

  return <main className="w-full h-full md:p-4 p-2"></main>;
};

export default AssetHistoryPage;
