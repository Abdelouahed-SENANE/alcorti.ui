
"use client";
import { cn } from "@/lib/utils";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { FieldWrapper } from "./field-wrapper";
import { useTranslation } from "react-i18next";

interface ImageUploadProps {
  label?: string;
  onChange: (file: File | null) => void;
  error?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  defaultPreview?: string;
}

export const ImageUpload = ({
  label,
  onChange,
  error,
  accept = "image/*",
  maxSize = 2,
  className,
  defaultPreview,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(defaultPreview || null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const {t} = useTranslation();
  const handleFile = (file: File | null) => {
    if (!file) {
      setPreview(null);
      onChange(null);
      return;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    onChange(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <FieldWrapper label={label} error={error} className={cn("space-y-2", className)}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "flex items-center gap-4 p-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50",
          error && "border-destructive"
        )}
      >
        {/* Preview */}
        <div className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden bg-muted">
          {preview ? (
            <>
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <ImagePlus className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Upload text */}
        <div className="flex-1 text-sm">
          <p className="font-medium text-foreground">
            {preview ? t("global.upload.click_to_change") : t("global.upload.click_to_upload")}
          </p>
          <p className="text-muted-foreground text-xs">
            {t("global.upload.max_size", {size: maxSize})}
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </div>

    </FieldWrapper>
  );
};