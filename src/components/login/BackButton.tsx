import { Button } from "../ui/button";

const BackButton = () => {
  return (
    <Button
      variant="link"
      className="font-normal w-full text-gray-500"
      size="sm"
      asChild
    >
      <div className="flex gap-1 hover:no-underline w-1">
        Dont have access?
        <span>Return</span>
        <a href="/">
          <span className="hover:text-red-500">Home.</span>
        </a>
      </div>
    </Button>
  );
};

export default BackButton;
