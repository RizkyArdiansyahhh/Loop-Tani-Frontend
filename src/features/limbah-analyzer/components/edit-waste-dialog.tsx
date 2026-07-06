"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { wasteTypes } from "../lib/dummy-data";

interface EditWasteDialogProps {
  currentType: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newType: string) => void;
}

const wasteTypeKeys = [
  "riceStraw",
  "riceHusk",
  "cornStalk",
  "palmFrond",
  "coconutHusk",
  "pineappleLeaves",
  "sugarcaneBagasse",
  "others",
];

const EditWasteDialog = ({
  currentType,
  isOpen,
  onClose,
  onConfirm,
}: EditWasteDialogProps) => {
  const t = useTranslations("analyzer");
  const [selected, setSelected] = useState(currentType);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" as const }}
            className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl"
          >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {t("editDialog.title")}
              </h3>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {wasteTypes.map((type, index) => (
                <button
                  key={type}
                  onClick={() => setSelected(type)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                    selected === type
                      ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {t(`wasteTypes.${wasteTypeKeys[index]}`)}
                  {selected === type && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={onClose}
              >
                {t("editDialog.cancel")}
              </Button>
              <Button
                className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  onConfirm(selected);
                  onClose();
                }}
              >
                {t("editDialog.confirm")}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditWasteDialog;
