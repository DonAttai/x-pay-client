import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "../button";
import { FormDataType } from "./transfer-money";

type PropType = {
  isModalOpen: boolean;
  onClose: () => void;
  handleSubmit: (data: FormDataType) => void;
  data: FormDataType;
  isPending: boolean;
};

export const TransferMoneyDialog = ({
  isModalOpen,
  onClose,
  data,
  handleSubmit,
  isPending,
}: PropType) => {
  if (!isModalOpen) return null;
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        Transfer {data.amount} to {data.walletId}
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => handleSubmit(data)}
          >
            {isPending ? "Loading..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
