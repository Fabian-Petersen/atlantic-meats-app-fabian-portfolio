import { useGetUser } from "@/utils/getUser";
import { Spinner } from "../ui/spinner";

const UserDetails = () => {
  const { data: user, isPending } = useGetUser(); // user from database

  return isPending ? (
    <div className="flex justify-center items-center text-primary">
      <Spinner className="w-8 h-8" />
    </div>
  ) : (
    <div className="flex flex-col gap-1 items-start justify-center text-(--clr-textLight)">
      <div className="capitalize text-xs flex gap-1">
        <span>Group:</span>
        <span>{user?.group ?? "admin"}</span>
      </div>
      <div className="capitalize text-xs flex gap-1">
        <span>Location:</span>
        <span>{user?.location ?? "central services"}</span>
      </div>
    </div>
  );
};

export default UserDetails;
