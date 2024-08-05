import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useSession, useSessionActions } from "@/store/session-store";

export function SessionExpiredModal() {
  const isSessionExpired = useSession();
  const { setSessionExpired } = useSessionActions();

  const handleSessionExpired = async () => {
    window.location.replace("/login");
    setSessionExpired(false);
  };
  return (
    <AlertDialog
      open={isSessionExpired}
      onOpenChange={() => setSessionExpired(false)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle></AlertDialogTitle>
          <AlertDialogDescription className="text-lg">
            Your session has expired! Login again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={handleSessionExpired}>Login</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
