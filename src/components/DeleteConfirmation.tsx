import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteConfirmationProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
  itemName?: string;
}

const DeleteConfirmation = ({
  isOpen = true,
  onOpenChange = () => {},
  onConfirm = () => {},
  onCancel = () => {},
  title = "Delete Confirmation",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName = "this item",
}: DeleteConfirmationProps) => {
  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description.replace("this item", itemName)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild onClick={handleCancel}>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild onClick={handleConfirm}>
            <Button variant="destructive">Delete</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmation;
