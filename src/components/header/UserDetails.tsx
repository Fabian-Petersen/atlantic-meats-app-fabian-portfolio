import { useGetUser } from "@/utils/getUser";
import { Spinner } from "../ui/spinner";

const UserDetails = () => {
  const { data: user, isPending } = useGetUser(); // user from database

  return isPending ? (
    <div className="flex justify-center items-center text-primary">
      <Spinner className="w-8 h-8" />
    </div>
  ) : (
    <div className="capitalize text-cxs font-sans font-semibold flex flex-col gap-1 items-start justify-center text-(--clr-textLight)">
      <span>{user?.group ?? "admin"}</span>
      <span>{user?.location ?? "central services"}</span>
    </div>
  );
};

export default UserDetails;
