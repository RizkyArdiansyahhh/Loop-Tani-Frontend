"use client";

import { Steps } from "@ark-ui/react/steps";
import { Check, Upload, ScanSearch, FileCheck2 } from "lucide-react";

interface StepDef {
  label: string;
  icon: typeof Upload;
}

const stepDefs: StepDef[] = [
  { label: "Upload", icon: Upload },
  { label: "Analyze", icon: ScanSearch },
  { label: "Result", icon: FileCheck2 },
];

interface HorizontalStepsProps {
  currentStep: number;
}

const HorizontalSteps = ({ currentStep }: HorizontalStepsProps) => {
  return (
    <div className="w-full">
      <Steps.Root count={3} defaultStep={currentStep} key={currentStep}>
        <Steps.List className="flex items-center">
          {stepDefs.map((stepDef, index) => {
            const Icon = stepDef.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <Steps.Item
                key={index}
                index={index}
                className="flex items-center not-last:flex-1"
              >
                <div className="flex flex-col items-center gap-1.5">
                  <Steps.Indicator
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-500 ${
                      isCompleted
                        ? "border-primary bg-primary text-primary-foreground"
                        : isCurrent
                          ? "border-primary bg-primary/10 text-primary ring-4 ring-primary/10"
                          : "border-border bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Icon className="h-3.5 w-3.5" />
                    )}
                  </Steps.Indicator>
                  <span
                    className={`text-[11px] font-medium transition-colors duration-300 ${
                      isCurrent || isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {stepDef.label}
                  </span>
                </div>

                {index < stepDefs.length - 1 && (
                  <div className="mx-2 mb-5 h-0.5 flex-1 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                      style={{
                        width: isCompleted ? "100%" : "0%",
                      }}
                    />
                  </div>
                )}
              </Steps.Item>
            );
          })}
        </Steps.List>
      </Steps.Root>
    </div>
  );
};

export default HorizontalSteps;
