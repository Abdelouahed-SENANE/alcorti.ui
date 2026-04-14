"use client";
import { cn } from "@/lib/utils";
import type { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useTheme } from "../ui/theme";

interface RadialChartProps {
  series: number[]; // e.g. [40, 25, 20, 15]
  labels: string[]; // ["Delivered","Cancelled","Pending","Returned"]
  total: number; // e.g. 3736
  title?: string;
  height?: number;
  className?: string;
}

export const RadialChart: React.FC<RadialChartProps> = ({
  series,
  labels,
  total,
  title,
  height = 330,
  className,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const COLORS = ["#7B4FFF", "#FF3E6C", "#FF5FB5", "#FFA363"];

  const options: ApexOptions = {
    chart: {
      type: "radialBar",
      height,
      toolbar: { show: false },
    },

    colors: COLORS,

    plotOptions: {
      radialBar: {
        offsetY: -20,

        startAngle: -90,
        endAngle: 90,

        hollow: {
          size: "55%",
        },

        track: {
          background: isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6",
          strokeWidth: "100%",
          margin: 10,
        },

        dataLabels: {
          name: {
            show: true,
            offsetY: 30,
            fontSize: "20px",
            fontWeight: 600,
            color: isDark ? "#fff" : "#111",
          },
          value: {
            show: true,
            offsetY: -10,
            fontSize: "24px",
            fontWeight: 700,
            formatter: () => total.toString(),
            color: isDark ? "#fff" : "#111",
          },
          total: {
            show: true,
            label: "Total",
            fontSize: "16px",
            fontWeight: 600,
            color: isDark ? "#fff" : "#111",
            formatter: () => total.toString(),
          },
        },
      },
    },

    labels,
    legend: { show: false },
    tooltip: { theme: isDark ? "dark" : "light" },
  };

  return (
    <Card className={cn("p-4 rounded-sm shadow-none", className)}>
      {title && (
        <CardHeader className="p-0 text-base font-semibold">{title}</CardHeader>
      )}

      <CardContent>
        <ReactApexChart
          options={options}
          series={series}
          type="radialBar"
          height={height}
        />
        <div className="mt-2 flex  max-w-80  flex-wrap justify-center  gap-3 text-xs">
          {labels.map((label, i) => (
            <div key={i} className="flex items-center  gap-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[i] }}
              />
              <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
