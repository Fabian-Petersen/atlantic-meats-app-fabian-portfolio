import type { UserAttributes } from "@/schemas";

type UserProfileProps = {
  user: UserAttributes | null;
};

function UserProfile({ user }: UserProfileProps) {
  if (!user) return null;

  return (
    <div>
      <ul className="flex flex-col gap-4 text-xs">
        <li className="flex gap-2">
          <span className="">Name</span>
          <span>:</span>
          <span className="flex-1">{user?.name}</span>
        </li>
        <li className="flex gap-2">
          <span>Email</span>
          <span>:</span>
          <span className="normal-case flex-1">{user?.email}</span>
        </li>
      </ul>
    </div>
  );
}

export default UserProfile;
