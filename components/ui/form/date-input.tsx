"use client";

import { Calendar1 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./field-wrapper";

export interface InputDateProps extends FieldWrapperPassThroughProps {
  label?: string;
  onChange: (newDate: Date | undefined) => void;
  val?: Date;
  placeholder?: string;
  className?: string;
}
export const DateInput = ({
  onChange,
  val,
  placeholder,
  label,
  error,
  className,
}: InputDateProps) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const dir = lang === "ar" ? "rtl" : "ltr";

  const normalize = (v: any): Date | undefined => {
    if (!v) return undefined;
    const d = v instanceof Date ? v : new Date(v);
    return isNaN(d.getTime()) ? undefined : d;
  };

  const initial = normalize(val);
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(initial);

  React.useEffect(() => {
    setDate(normalize(val));
  }, [val?.getTime()]);

  return (
    <FieldWrapper label={label} error={error} className={className}>
      <Popover modal={false} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="plain"
            dir={dir}
            id="date"
            data-state={open ? "open" : "closed"}
            className={cn(
              "peer cursor-pointer relative text-card-foreground flex items-center justify-between h-9 w-full rounded-sm border border-border bg-transparent px-2 py-1 text-sm",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:border-primary focus-visible:ring-primary/50",
              "data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/50 ",
              error && "border-error/80 ring-3 ring-error/40",
              !val && "text-card-foreground/50",
            )}
          >
            {date ? (
              format(date, "dd/MM/yyyy")
            ) : (
              <span className="text-card-foreground/50">{placeholder}</span>
            )}
            <Calendar1 className="h-4 w-4 opacity-70" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0 bg-card"
          align={dir === "rtl" ? "start" : "end"}
          dir={dir}
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date: Date | undefined) => {
              onChange(date);
              setDate(date);
              setOpen(false);
            }}
            required={false}
            dir={dir}
            locale={lang === "ar" ? undefined : undefined} // react-day-picker handles locale if passed, otherwise it uses default
          />
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  );
};
