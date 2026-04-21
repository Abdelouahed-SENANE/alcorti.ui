"use client";

import { format } from "date-fns";
import { ar, enUS, fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar/calendar";
import { Input } from "@/components/ui/form/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover/popover";
import { cn } from "@/lib/utils";
import { FieldWrapper } from "./field-wrapper";

const locales: Record<string, any> = { ar, fr, en: enUS };

function formatDate(date: Date | undefined, locale: any) {
  if (!date || isNaN(date.getTime())) {
    return "";
  }

  return format(date, "PPP", { locale });
}

export type InputCalenderProps = {
  onChange?: (date: Date | undefined) => void;
  value?: Date | undefined;
  label?: string;
  error?: string;
  isRequired?: boolean;
};

export const InputCalendar: React.FC<InputCalenderProps> = ({
  onChange,
  value,
  label,
  error,
  isRequired,
}) => {
  const { i18n } = useTranslation();
  const currentLocale = locales[i18n.language] || fr;
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [txtValue, setTxtValue] = React.useState(
    formatDate(date, currentLocale),
  );

  React.useEffect(() => {
    setDate(value);
    setMonth(value);
    setTxtValue(formatDate(value, currentLocale));
  }, [value, currentLocale]);

  function updateDate(newDate: Date | undefined) {
    setDate(newDate);
    setTxtValue(formatDate(newDate, currentLocale));
    setMonth(newDate);
    if (onChange) onChange(newDate);
  }

  return (
    <FieldWrapper error={error} className="relative gap-2">
      <Input
        id="date"
        value={txtValue}
        label={label}
        isRequired={isRequired}
        className={cn(
          "w-full cursor-pointer border placeholder:text-foreground/50",
          error && "border-destructive/80 ring-3 ring-destructive/40",
        )}
        readOnly
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        onClick={() => setOpen(true)}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-picker"
            variant="plain"
            size="icon"
            className="absolute top-1/2 ltr:right-1 rtl:left-1 size-6 -translate-y-1/2"
          >
            <CalendarIcon className="size-4" />
            <span className="sr-only">Select date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden bg-card p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={date}
            locale={currentLocale}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={(date) => {
              updateDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  );
};
