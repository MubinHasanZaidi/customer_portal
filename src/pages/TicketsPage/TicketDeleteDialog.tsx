import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

interface TicketDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  isLoading?: boolean;
  ticketCode?: string;
}

const TicketDeleteDialog: React.FC<TicketDeleteDialogProps> = ({
  open,
  onClose,
  onDelete,
  isLoading = false,
  ticketCode,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Delete Ticket</DialogTitle>
        </DialogHeader>
        <hr />
        <p className="text-sm text-gray-700">
          Are you sure you want to delete
          {ticketCode ? ` ticket ${ticketCode}` : " this ticket"}?
        </p>
        <DialogFooter>
          <button
            type="button"
            className="px-4 w-fit disabled:opacity-50 h-fit hover:bg-transparent text-sm hover:text-[#222222] border-2 border-[#222222] bg-white text-[#222222] py-2 rounded-full font-medium hover:bg-black transition-colors"
            onClick={onClose}
            disabled={isLoading}
          >
            Close
          </button>
          <button
            type="button"
            className="px-4 w-fit disabled:opacity-50 h-fit text-sm border-2 border-red-600 bg-red-600 text-white py-2 rounded-full font-medium hover:bg-white hover:text-red-600 transition-colors"
            onClick={onDelete}
            disabled={isLoading}
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDeleteDialog;
