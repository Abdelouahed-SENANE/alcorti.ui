"use client";
import { cn } from "@/lib/utils";
import imageCompression from "browser-image-compression";
import { FileText, Plus, Trash2, UploadCloud } from "lucide-react";
import * as React from "react";
import { type UseFormRegisterReturn } from "react-hook-form";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./field-wrapper";

type PreviewFile = {
  file: File;
  preview?: string;
};

export type FileInputProps = FieldWrapperPassThroughProps & {
  registration?: Partial<UseFormRegisterReturn>;
  onFilesSelect?: (files: File[]) => void;
  compress?: boolean;
  maxSizeMB?: number;
  accept?: string;
  multiple?: boolean;
  placeholder?: string;
  className?: string;
};

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      label,
      error,
      registration,
      onFilesSelect,
      compress = true,
      maxSizeMB = 20,
      accept = "image/*,application/pdf",
      multiple = true,
      className,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const [files, setFiles] = React.useState<PreviewFile[]>([]);
    const [isCompressing, setIsCompressing] = React.useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(e.target.files ?? []);
      if (!selected.length) return;

      setIsCompressing(true);
      const processed: PreviewFile[] = [];
      const filesToProcess = multiple ? selected : [selected[0]];

      for (const originalFile of filesToProcess) {
        let finalFile: File;

        if (compress && originalFile.type.startsWith("image/")) {
          const compressed: Blob | File = await imageCompression(originalFile, {
            maxSizeMB,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });
          finalFile =
            compressed instanceof File
              ? compressed
              : new File([compressed], originalFile.name, {
                  type: compressed.type,
                  lastModified: originalFile.lastModified,
                });
        } else {
          finalFile = originalFile;
        }

        processed.push({
          file: finalFile,
          preview: finalFile.type.startsWith("image/")
            ? URL.createObjectURL(finalFile)
            : undefined,
        });
      }

      setFiles((prev) => {
        if (!multiple) {
          prev.forEach((f) => {
            if (f.preview) URL.revokeObjectURL(f.preview);
          });
        }
        const next = multiple ? [...prev, ...processed] : processed;
        onFilesSelect?.(next.map((f) => f.file));
        return next;
      });

      setIsCompressing(false);
      e.target.value = "";
    };

    React.useEffect(() => {
      return () => {
        files.forEach((f) => {
          if (f.preview) URL.revokeObjectURL(f.preview);
        });
      };
    }, []);

    const removeFile = (index: number) => {
      setFiles((prev) => {
        const next = [...prev];
        const removed = next.splice(index, 1);
        if (removed[0]?.preview) {
          URL.revokeObjectURL(removed[0].preview);
        }
        onFilesSelect?.(next.map((f) => f.file));
        return next;
      });
    };

    const hasFiles = files.length > 0;

    return (
      <FieldWrapper label={label} error={error}>
        <div
          className={cn(
            "relative border border-dashed rounded-md bg-muted/30 transition-colors",
            "hover:border-primary hover:bg-muted/50",
            error && "border-destructive",
            hasFiles ? "p-2" : "p-4",
            className,
          )}
        >
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            ref={ref}
            {...registration}
            {...props}
            onChange={handleFileChange}
          />

          {/* Empty State */}
          {!hasFiles && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <UploadCloud className="size-4" />
              <span className="text-sm">
                {isCompressing ? "Processing..." : placeholder ?? "Upload files"}
              </span>
            </div>
          )}

          {/* Files Preview */}
          {hasFiles && (
            <div className="flex flex-wrap gap-2">
              {files.map((item, index) => (
                <div
                  key={index}
                  className="relative group flex items-center gap-2 bg-background border rounded-md px-2 py-1.5"
                >
                  {item.preview ? (
                    <img
                      src={item.preview}
                      className="size-6 rounded object-cover"
                      alt=""
                    />
                  ) : (
                    <FileText className="size-5 text-muted-foreground" />
                  )}
                  <span className="text-xs max-w-[100px] truncate">
                    {item.file.name}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="text-muted-foreground hover:text-destructive z-20"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}

              {/* Add More Button */}
              {multiple && (
                <div className="flex items-center justify-center px-3 py-1.5 border border-dashed rounded-md text-card-foreground">
                  <Plus className="size-4" />
                </div>
              )}
            </div>
          )}
        </div>
      </FieldWrapper>
    );
  },
);

FileInput.displayName = "FileInput";