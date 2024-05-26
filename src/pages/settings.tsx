import { Button } from "@/components/ui/button";

export const Settings = () => {
  return (
    <div className="space-x-4">
      <Button variant={"outline"}>Enable 2FA</Button>
      <Button variant={"outline"}>Change Pin</Button>
    </div>
  );
};
