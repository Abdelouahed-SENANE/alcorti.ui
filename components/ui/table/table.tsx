"use client";
import { ChevronRight, Inbox } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { BaseEntity } from "@/types/api";

import { useTranslation } from "react-i18next";
import { Checkbox } from "../form";
import SortIcon from "../icons/sort-icon";
import { Spinner } from "../spinner";
import { TablePagination, TablePaginationProps } from "./table-pagination";

const TableElement = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div
    className="relative w-full overflow-auto"
    dir={document.documentElement.dir || "ltr"}
  >
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm  bg-background ", className)}
      {...props}
    />
  </div>
));
TableElement.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("[&_tr]:border-b h-12  border-border bg-background", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn("border-b data-[state=selected]:bg-background", className)}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "ltr:text-left rtl:text-right align-middle px-2  py-2.5 text-xs font-bold  text-card-foreground *:[[role=checkbox]]:translate-y-0.5",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle  *:[[role=checkbox]]:translate-y-0.5",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-card-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  TableBody,
  TableCaption,
  TableCell,
  TableElement,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};

export type TableColumn<Entry> = {
  title: React.ReactNode;
  field: keyof Entry;
  sortable?: boolean;
  Cell?({
    entry,
    rowIndex,
  }: {
    entry: Entry;
    rowIndex: number;
  }): React.ReactElement;
};
export interface SortConfig<Entry> {
  key: keyof Entry | null;
  direction: "asc" | "desc";
}
export type TableProps<Entry extends BaseEntity> = {
  data: Entry[];
  columns: TableColumn<Entry>[];
  isLoading?: boolean;

  sort?: keyof Entry;
  order?: "asc" | "desc";
  onSortChange?: (field: keyof Entry, direction: "asc" | "desc") => void;

  selectedRows?: Set<string | number>;
  onSelectRow?: (id: string | number) => void;
  onSelectAll?: () => void;

  emptyMessage?: string;
  renderSubComponent?: (entry: Entry) => React.ReactNode;
  pagination?: TablePaginationProps;
};

export const Table = <Entry extends BaseEntity>({
  data,
  columns,
  isLoading = false,
  sort,
  order = "asc",
  onSortChange,
  selectedRows,
  onSelectRow,
  onSelectAll,
  emptyMessage = "No entries found.",
  renderSubComponent,
  pagination,
}: TableProps<Entry>) => {
  const { t } = useTranslation();
  const [expandedRows, setExpandedRows] = React.useState<Set<string | number>>(
    new Set(),
  );

  const toggleExpand = (id: string | number) => {
    const next = new Set(expandedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRows(next);
  };

  const handleSort = (field: keyof Entry) => {
    if (!onSortChange) return;

    const nextDir = sort === field && order === "asc" ? "desc" : "asc";

    onSortChange(field, nextDir);
  };

  return (
    <div className="flex flex-col bg-card overflow-hidden rounded-md border border-border">
      <TableElement>
        {/* HEADER */}
        <TableHeader className="bg-card">
          <TableRow>
            {renderSubComponent && <TableHead className="w-10" />}
            {selectedRows && onSelectAll && (
              <TableHead className="p-2">
                <Checkbox
                  checked={selectedRows.size === data.length && data.length > 0}
                  onCheckedChange={() => onSelectAll?.()}
                />
              </TableHead>
            )}

            {columns.map((column, index) => {
              const active = sort === column.field;
              const directionForIcon = active ? order : "default";

              return (
                <TableHead
                  key={index}
                  className={cn(
                    column.sortable
                      ? "cursor-pointer select-none uppercase text-xxs"
                      : "py-2",
                  )}
                  onClick={() => column.sortable && handleSort(column.field)}
                >
                  <div className="flex items-center gap-1">
                    {column.title}
                    {column.sortable && (
                      <SortIcon
                        className="mx-px"
                        direction={directionForIcon}
                      />
                    )}
                  </div>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>

        {/* BODY */}
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="text-center py-5"
              >
                <div className="flex items-center justify-center gap-2 text-card-foreground/60">
                <Spinner size="sm" />
                  <span className="text-xs">{t("global.loading")}</span>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="text-center py-5"
              >
                <div className="flex items-center justify-center gap-2 text-card-foreground/60">
                  <Inbox className="size-5" />
                  {emptyMessage}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((entry, idx) => {
              const isExpanded = expandedRows.has(entry.id!);
              return (
                <React.Fragment key={entry.id ?? idx}>
                  <TableRow
                    className={`hover:bg-background/50 h-10 ${
                      selectedRows?.has(entry.id!) ? "bg-foreground/4" : ""
                    }`}
                  >
                    {renderSubComponent && (
                      <TableCell className="w-10">
                        <button
                          onClick={() => toggleExpand(entry.id!)}
                          className="flex items-center justify-center  hover:bg-input/50  p-1 rounded-sm transition-transform"
                        >
                          <ChevronRight
                            className={cn(
                              "size-4 transition-transform",
                              isExpanded &&
                                (document.documentElement.dir === "rtl"
                                  ? "-rotate-90"
                                  : "rotate-90"),
                            )}
                          />
                        </button>
                      </TableCell>
                    )}
                    {selectedRows && onSelectRow && (
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.has(entry.id!)}
                          onCheckedChange={() => onSelectRow(entry.id!)}
                        />
                      </TableCell>
                    )}

                    {columns.map(({ Cell, field }, colIdx) => (
                      <TableCell key={colIdx} className="text-card-foreground">
                        {Cell ? (
                          <Cell entry={entry} rowIndex={idx} />
                        ) : (
                          String(entry[field] ?? "")
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {isExpanded && renderSubComponent && (
                    <TableRow className="hover:bg-transparent border-none">
                      <TableCell
                        colSpan={
                          columns.length +
                          (selectedRows ? 1 : 0) +
                          (!!renderSubComponent ? 1 : 0)
                        }
                        className="p-0 border-none"
                      >
                        {renderSubComponent(entry)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </TableElement>
      {pagination && (
        <div className="border-t border-border">
          <TablePagination {...pagination} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
};
