"use client";

import { format } from "date-fns";
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./field-wrapper";

interface InputTimeProps extends FieldWrapperPassThroughProps {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function InputTime({
  value,
  onChange,
  placeholder = "HH:mm",
  error,
  label,
  disabled,
}: InputTimeProps) {
  function handleTimeChange(type: "hour" | "minute", val: number) {
    const base = value ?? new Date();
    const next = new Date(base);

    if (type === "hour") next.setHours(val);
    if (type === "minute") next.setMinutes(val);

    onChange(next);
  }

  const { i18n } = useTranslation();
  const lang = i18n.language;
  const dir = lang === "ar" ? "rtl" : "ltr";

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <FieldWrapper label={label} error={error}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"plain"}
            dir={dir}
            disabled={disabled}
            className={cn(
              "peer cursor-pointer relative text-card-foreground flex items-center justify-between h-9 w-full rounded-sm border border-border bg-transparent px-2 py-1 text-sm",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:border-primary focus-visible:ring-primary/50",
              "data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/50 ",
              error && "border-error/80 ring-3 ring-error/40",
              (!value || disabled) && "text-foreground/50",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            {value ? (
              format(value, "HH:mm")
            ) : (
              <span className="text-card-foreground/50">{placeholder}</span>
            )}
            <Clock className="h-4 w-4 opacity-70" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0 bg-card"
          align={dir === "rtl" ? "start" : "end"}
          dir={dir}
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="flex h-[300px] divide-x divide-border">
            {/* HOURS */}
            <ScrollArea className="w-16 h-full">
              <div className="flex flex-col p-2">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    size="icon-sm"
                    variant={
                      value && value.getHours() === hour ? "default" : "ghost"
                    }
                    className="shrink-0"
                    onClick={() => handleTimeChange("hour", hour)}
                  >
                    {hour.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar />
            </ScrollArea>

            {/* MINUTES */}
            <ScrollArea className="w-16 h-full">
              <div className="flex flex-col p-2">
                {minutes.map((minute) => (
                  <Button
                    key={minute}
                    size="icon-sm"
                    variant={
                      value && value.getMinutes() === minute
                        ? "default"
                        : "ghost"
                    }
                    className="shrink-0"
                    onClick={() => handleTimeChange("minute", minute)}
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar />
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  );
}
