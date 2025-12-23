// Dashboard Page
import { Button } from "@/components/ui/button";
import { signOut } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    // Optionally, you can redirect the user to the login page after sign out
    window.location.href = "/";
  };

  return (
    <section className="px-4 h-screen lg:h-screen bg-cover bg-center bg-no-repeat">
      <Button
        className="fixed bg-(--clr-primary) text-white leading-2 hover:bg-(--clr-primary)/90 hover:cursor-pointer uppercase tracking-wider py-6 mt-54"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
      <div className="flex justify-center items-center h-full w-full border border-red-500">
        <Button
          className="bg-blue-400 p-4 text-white rounded-lg mx-2 hover:cursor-pointer"
          onClick={() => navigate("/assets")}
        >
          Assets
        </Button>
        <Button
          className="bg-blue-400 p-4 text-white rounded-lg mx-2 hover:cursor-pointer"
          onClick={() => navigate("/create-job")}
        >
          create job
        </Button>
      </div>
    </section>
  );
};

export default Dashboard;
