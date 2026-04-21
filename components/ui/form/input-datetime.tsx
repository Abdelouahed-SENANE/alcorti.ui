"use client";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Calendar1 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./field-wrapper";

interface InputDateTimeProps extends FieldWrapperPassThroughProps {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
}

export function InputDateTime({
  value,
  onChange,
  placeholder = "MM/DD/YYYY HH:mm",
  error,
  label,
}: InputDateTimeProps) {
  function handleDateSelect(date?: Date) {
    if (!date) return;

    const base = value ?? new Date();
    date.setHours(base.getHours());
    date.setMinutes(base.getMinutes());

    onChange(date);
  }

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

  return (
    <FieldWrapper label={label} error={error}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"plain"}
            dir={dir}
            className={cn(
              "peer cursor-pointer relative text-card-foreground flex items-center justify-between h-9 w-full rounded-sm border border-border bg-transparent px-2 py-1 text-sm",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:border-primary focus-visible:ring-primary/50",
              "data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/50 ",
              error && "border-error/80 ring-3 ring-error/40",
              !value && "text-foreground/50",
            )}
          >
            {value ? (
              format(value, "dd/MM/yyyy HH:mm")
            ) : (
              <span className="text-card-foreground/50">{placeholder}</span>
            )}
            <Calendar1 className="h-4 w-4 opacity-70" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0 bg-card "
          align={dir === "rtl" ? "start" : "end"}
          dir={dir}
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="sm:flex">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              autoFocus
            />

            <div className="flex sm:h-[300px] divide-x">
              {/* HOURS */}
              <ScrollArea className="w-24">
                <div className="flex sm:flex-col p-2">
                  {Array.from({ length: 24 }).map((_, hour) => (
                    <Button
                      className="flex items-center justify-center p-1"
                      key={hour}
                      size="icon"
                      variant={value?.getHours() === hour ? "default" : "ghost"}
                      onClick={() => handleTimeChange("hour", hour)}
                    >
                      {hour >= 10 ? hour : `0${hour}`}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {/* MINUTES */}
              <ScrollArea className="w-24">
                <div className="flex sm:flex-col p-2">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const minute = i * 5;
                    return (
                      <Button
                        className="flex items-center justify-center"
                        key={minute}
                        size="icon"
                        variant={
                          value?.getMinutes() === minute ? "default" : "ghost"
                        }
                        onClick={() => handleTimeChange("minute", minute)}
                      >
                        {minute.toString().padStart(2, "0")}
                      </Button>
                    );
                  })}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  );
}
