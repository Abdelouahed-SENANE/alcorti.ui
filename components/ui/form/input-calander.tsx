"use client";

import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar/calendar";
import { Input } from "@/components/ui/form/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover/popover";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}
export type InputCalenderProps = {
  onChange?: (date: Date | undefined) => void;
  value?: Date | undefined;
};
export const InputCalendar: React.FC<InputCalenderProps> = ({
  onChange,
  value,
}) => {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [txtValue, setTxtValue] = React.useState(formatDate(date));

  React.useEffect(() => {
    setDate(value);
    setMonth(value);
    setTxtValue(formatDate(value));
  }, [value]);

  function updateDate(newDate: Date | undefined) {
    setDate(newDate);
    setTxtValue(formatDate(newDate));
    setMonth(newDate);
    if (onChange) onChange(newDate);
  }

  return (
    <div className="relative w-fit flex gap-2">
      <Input
        id="date"
        value={txtValue}
        placeholder="June 01, 2025"
        className="pr-10 w-full bg-primary placeholder:text-gray-300"
        onChange={(e) => {
          const date = new Date(e.target.value);
          setTxtValue(e.target.value);
          if (isValidDate(date)) {
            updateDate(date);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-picker"
            variant="ghost"
            className="absolute  top-1/2 right-0 p-1 size-6 -translate-y-1/2"
          >
            <CalendarIcon className="size-4" />
            <span className="sr-only">Select date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden bg-card  p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={date}
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
    </div>
  );
};
