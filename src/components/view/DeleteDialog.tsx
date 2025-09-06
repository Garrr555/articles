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

type DeleteConfirmationProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isDeleting?: boolean;
};

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  isDeleting = false,
}: DeleteConfirmationProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Article</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Are you sure you want to delete this article?</p>
            <div className="bg-gray-50 p-3 rounded-md border">
              <p className="font-medium text-sm text-gray-800">{title}</p>
            </div>
            <p className="text-red-600 text-sm font-medium">
              ⚠️ This action cannot be undone. The article will be permanently
              deleted.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              "Delete Article"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
