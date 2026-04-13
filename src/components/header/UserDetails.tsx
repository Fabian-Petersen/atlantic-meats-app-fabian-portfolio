import { useGetUser } from "@/utils/getUser";
import { Spinner } from "../ui/spinner";
import { MapPin, User } from "lucide-react";

const UserDetails = () => {
  const { data: user, isPending } = useGetUser(); // user from database

  return isPending ? (
    <div className="flex justify-center items-center text-primary">
      <Spinner className="w-8 h-8" />
    </div>
  ) : (
    <div className="capitalize text-xs font-sans font-semibold flex flex-col md:flex-row gap-2 md:gap-4 items-start justify-center text-(--clr-textLight)">
      <div className="flex gap-0.5 items-center">
        <User className="size-4" />
        <span>{user?.group ?? "admin"}</span>
      </div>
      <div className="flex gap-0.5 items-center">
        <MapPin className="size-4" />
        <span>{user?.location ?? "central services"}</span>
      </div>
    </div>
  );
};

export default UserDetails;
