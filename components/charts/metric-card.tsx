"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MoveDown, MoveUp } from "lucide-react";

type MetricCardProps = {
  title: string;
  icon?: React.ReactNode;
  value: number;
  percentage: number;
  color?: string;
  className?: string;
};

export const MetricCard = ({
  title,
  icon,
  value,
  percentage,
  color,
  className,
}: MetricCardProps) => {
  const isPositive = percentage > 0;
  console.log(color);

  return (
    <Card
      className={cn("p-4 shadow-none gap-0 rounded-sm space-y-2", className)}
    >
      <CardContent className="p-0 flex items-start justify-between">
        <div>
          <h6 className="text-sm text-card-foreground/70 ">{title}</h6>
          <p className="text-3xl text-card-foreground">{value}</p>
        </div>
        <div
          style={{ backgroundColor: color }}
          className={`size-9 text-white rounded-full flex items-center justify-center`}
        >
          {icon}
        </div>
      </CardContent>
      <CardFooter className="p-0 flex items-center gap-0.5">
        <span className="text-xs text-card-foreground/70">
          {isPositive ? "Increased" : "Decreased"} by{" "}
        </span>
        <p
          className={cn(
            "text-sm font-semibold",
            isPositive ? "text-success" : "text-danger"
          )}
        >
          {percentage}%
        </p>
        {isPositive ? (
          <MoveUp className="text-green-400 size-3.5" />
        ) : (
          <MoveDown className="text-red-600 size-3.5" />
        )}
      </CardFooter>
    </Card>
  );
};
