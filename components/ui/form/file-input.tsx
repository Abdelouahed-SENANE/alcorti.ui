"use client";
import { cn, formatFileSize } from "@/lib/utils";
import imageCompression from "browser-image-compression";
import { FileText, Trash2, UploadCloud } from "lucide-react";
import * as React from "react";
import { type UseFormRegisterReturn } from "react-hook-form";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./field-wrapper";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
type PreviewFile = {
  file: File;
  preview?: string;
};

/* ------------------------------------------------------------------ */
/* Props                                                              */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
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

    /* -------------------------------------------------------------- */
    /* Handle File Selection                                          */
    /* -------------------------------------------------------------- */
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(e.target.files ?? []);
      if (!selected.length) return;

      setIsCompressing(true);

      const processed: PreviewFile[] = [];

      // If single file mode, only take the first one
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
        // Revoke old previews if replacing
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

    /* -------------------------------------------------------------- */
    /* Remove File                                                    */
    /* -------------------------------------------------------------- */
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

    /* -------------------------------------------------------------- */
    /* Render                                                         */
    /* -------------------------------------------------------------- */
    return (
      <FieldWrapper label={label} error={error}>
        <div
          className={cn(
            "relative border-2 mb-4 border-dashed rounded-sm bg-card p-3 flex flex-col gap-3 cursor-pointer hover:border-primary hover:ring-[3px] hover:ring-primary/50 transition-colors",
            className,
          )}
        >
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            className="absolute inset-0 opacity-0 cursor-pointer"
            ref={ref}
            {...registration}
            {...props}
            onChange={handleFileChange}
          />

          {/* Placeholder */}
          <div className="flex flex-col items-center justify-center py-3 text-foreground/70">
            <UploadCloud className="size-6 mb-2 text-primary" />
            <p className="text-sm">
              {isCompressing
                ? "Processing files..."
                : "Click or drag files here"}
            </p>
            <p className="text-xs text-foreground/50">
              {placeholder ? placeholder : "Images & PDF up to"} {maxSizeMB}MB
            </p>
          </div>
        </div>
        {files.map((item, index) => (
          <div
            key={index}
            className="flex items-center  relative gap-2 border mb-1 rounded-md py-2 pl-2 pr-8 bg-background"
          >
            {item.preview ? (
              <img
                src={item.preview}
                className="size-8 rounded object-cover border"
                alt=""
              />
            ) : (
              <FileText className="size-8 text-primary" />
            )}

            <div className="flex-1 text-sm truncate">
              {item.file.name}
              <br />
              <span className="text-foreground/90 text-sm font-bold">
                {formatFileSize(item.file.size)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => removeFile(index)}
              className="text-forground absolute cursor-pointer hover:text-error/70 top-2 right-2"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </FieldWrapper>
    );
  },
);

FileInput.displayName = "FileInput";
