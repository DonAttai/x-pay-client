import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";

export const Settings = () => {
  const { data: user } = useUser();
  return (
    <div className="space-x-4">
      <Button variant={"outline"}>Enable 2FA</Button>
      <Button variant={"outline"}>Change Pin</Button>
    </div>
  );
};
