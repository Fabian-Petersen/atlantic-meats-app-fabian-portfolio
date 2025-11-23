import { Card, CardContent, CardHeader } from "@/components/ui/card";

// $ Import Components to be used in CardWrapper
import Header from "./Header";

// $ Define the Props for CardWrapper
type CardWrapperProps = {
  children: React.ReactNode;
  headerLabel: string;
};

const CardWrapper = ({ children, headerLabel }: CardWrapperProps) => {
  return (
    <Card className="max-w-100 w-full dark:bg-slate-800 bg-gray-300 border-shadow-md shadow-white/10">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default CardWrapper;
