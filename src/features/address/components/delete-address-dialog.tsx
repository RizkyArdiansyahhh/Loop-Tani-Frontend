"use client";

import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteAddressDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteAddressDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteAddressDialogProps) {
  const t = useTranslations("address.deleteDialog");

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-xl max-w-sm sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-poppins text-lg font-bold text-gray-900 dark:text-white">
            {t("title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {t("description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row items-center justify-end gap-2 mt-4">
          <AlertDialogCancel asChild>
            <Button variant="outline" size="sm" disabled={isLoading} className="cursor-pointer">
              {t("cancel")}
            </Button>
          </AlertDialogCancel>
          <Button
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
            className="cursor-pointer"
          >
            {t("confirm")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
