"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { useUploadAvatar } from "../hooks/use-upload-avatar";

interface AvatarUploaderProps {
  currentAvatar: string | null;
  name: string;
}

export function AvatarUploader({ currentAvatar, name }: AvatarUploaderProps) {
  const t = useTranslations("profile.avatar");
  const uploadAvatar = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Local state for immediate preview
  const [preview, setPreview] = useState<string | null>(null);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Upload
    uploadAvatar.mutate(file, {
      onSettled: () => {
        // Cleanup object URL
        URL.revokeObjectURL(objectUrl);
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    });
  };

  const isUploading = uploadAvatar.isPending;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <Avatar className="h-24 w-24 border-2 border-border/50">
          <AvatarImage src={preview || currentAvatar || undefined} alt={name} className="object-cover" />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        
        {isUploading && (
          <div className="absolute inset-0 bg-background/50 rounded-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        
        {!isUploading && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full shadow-sm hover:bg-primary/90 transition-colors"
            title={t("upload")}
          >
            <Camera className="h-4 w-4" />
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileChange}
      />
      
      <div className="text-center">
        <p className="text-xs text-muted-foreground">{t("formatHint")}</p>
        <p className="text-xs text-muted-foreground">{t("sizeHint")}</p>
      </div>
    </div>
  );
}
