"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Leaf,
  Coins,
  CircleCheck,
  Pencil,
  Sparkles,
  RotateCcw,
  Target,
  Gauge,
  Lightbulb,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type AnalysisResult, formatRupiah } from "../lib/dummy-data";
import EditWasteDialog from "./edit-waste-dialog";

interface ResultStepProps {
  result: AnalysisResult;
  preview: string;
  onReset: () => void;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const ResultStep = ({ result, preview, onReset }: ResultStepProps) => {
  const t = useTranslations("analyzer");
  const [editedResult, setEditedResult] = useState(result);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [confirmed, setConfirmed] = useState<boolean | null>(null);

  const handleEditConfirm = (newType: string) => {
    setEditedResult((prev) => ({ ...prev, wasteType: newType }));
    setConfirmed(null);
  };

  return (
    <div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col lg:flex-row"
      >
        {/* LEFT — Analysis Details (65%) */}
        <div className="flex flex-1 flex-col border-border/40 p-8 lg:border-r lg:p-10">
          {/* Photo + Waste Type */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex gap-4">
              <img
                src={preview}
                alt="Analyzed"
                className="h-24 w-24 shrink-0 rounded-2xl object-cover shadow-sm"
              />
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">
                    {editedResult.wasteType}
                  </h3>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                    {editedResult.confidence}% {t("summary.confidence")}
                  </Badge>
                  <Badge variant="secondary">{editedResult.condition}</Badge>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Detail Rows */}
          <motion.div variants={itemVariants} className="space-y-4">
            <ResultRow
              icon={Target}
              label={t("result.condition")}
              value={editedResult.condition}
              badgeColor="bg-primary/10 text-primary"
            />
            <ResultRow
              icon={Gauge}
              label={t("result.estimatedQuantity")}
              value={editedResult.estimatedQuantity}
              badgeColor="bg-secondary/40 text-secondary-foreground"
            />
            <ResultRow
              icon={Lightbulb}
              label={t("result.recommendedUtilization")}
              value={editedResult.recommendations.join(", ")}
              badgeColor="bg-accent/15 text-accent-foreground"
            />
          </motion.div>

          {/* Recommendations as pills */}
          <motion.div variants={itemVariants} className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("result.recommendedUtilization")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {editedResult.recommendations.map((rec) => (
                <span
                  key={rec}
                  className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                >
                  {rec}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Confirmation */}
          <motion.div variants={itemVariants} className="mt-8">
            <div className="rounded-xl border border-border/40 bg-muted/20 p-4">
              <p className="mb-3 text-sm font-medium text-foreground">
                {t("result.confirmationTitle")}
              </p>
              {confirmed === null && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="gap-2 rounded-xl border-primary/30 text-primary hover:bg-primary/5"
                    onClick={() => setConfirmed(true)}
                  >
                    <CircleCheck className="h-4 w-4" />
                    {t("result.yes")}
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 rounded-xl"
                    onClick={() => setIsEditOpen(true)}
                  >
                    <Pencil className="h-4 w-4" />
                    {t("result.editWasteType")}
                  </Button>
                </div>
              )}
              {confirmed === true && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 text-sm text-primary"
                >
                  <CircleCheck className="h-4 w-4" />
                  {t("result.confirmed", { type: editedResult.wasteType })}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Reset */}
          <motion.div variants={itemVariants} className="mt-4">
            <Button
              variant="ghost"
              className="w-full gap-2 rounded-xl text-muted-foreground"
              onClick={onReset}
            >
              <RotateCcw className="h-4 w-4" />
              {t("result.analyzeAnother")}
            </Button>
          </motion.div>
        </div>

        {/* RIGHT — Value Summary (35%) */}
        <div className="flex flex-col bg-gradient-to-br from-primary/5 to-muted/20 p-8 lg:w-[35%] lg:p-10">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-foreground">
              {t("result.estimatedMarketValue")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("result.aiEstimation")}
            </p>
          </div>

          <motion.div
            variants={itemVariants}
            className="flex flex-1 flex-col items-center justify-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Coins className="h-7 w-7 text-primary" />
            </div>
            <p className="mt-4 text-4xl font-bold text-primary">
              {formatRupiah(editedResult.estimatedValue)}
            </p>
            <p className="mt-2 text-center text-xs leading-relaxed text-muted-foreground">
              {t("result.disclaimer")}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-6">
            <Button
              className="h-12 w-full rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
              onClick={() => {
                console.log("Sell Now:", editedResult);
              }}
            >
              {t("result.sellNow")}
            </Button>
          </motion.div>

          <div className="mt-4 rounded-xl bg-white/60 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold text-primary">
                {t("summary.aiTitle")}
              </p>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              {t("result.analysisComplete", {
                confidence: editedResult.confidence,
              })}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Edit Dialog */}
      <EditWasteDialog
        currentType={editedResult.wasteType}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onConfirm={handleEditConfirm}
      />
    </div>
  );
};

const ResultRow = ({
  icon: Icon,
  label,
  value,
  badgeColor,
}: {
  icon: typeof Leaf;
  label: string;
  value: string;
  badgeColor: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="flex flex-1 items-center justify-between">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span
        className={`rounded-full px-3 py-1 text-[11px] font-medium ${badgeColor}`}
      >
        {value}
      </span>
    </div>
  </div>
);

export default ResultStep;
