"use client";
import { cn } from "@/lib/utils";
import type { ApexAxisChartSeries, ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useTheme } from "../ui/theme";

export interface LineChartProps {
  series: ApexAxisChartSeries;
  labels?: string[];
  height?: number;
  className?: string;
  title?: string;
}

// Helper to read CSS vars safely

export const LineChart: React.FC<LineChartProps> = ({
  series,
  labels,
  height = 340,
  className,
  title,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const PURPLE = "#8753ff";
  const PINK = "#ff4bc3";

  const LIGHT_GRID = "rgba(0,0,0,0.08)";
  const DARK_GRID = "rgba(255,255,255,0.08)";

  const LIGHT_LABEL = "rgba(0,0,0,0.65)";
  const DARK_LABEL = "rgba(255,255,255,0.65)";

  const BROWN = "rgba(72, 47, 35, 0.70)";
  const GRAY = "rgba(255,255,255,0.40)";
  const options: ApexOptions = {
    chart: {
      type: "line",
      stacked: false,
      toolbar: { show: false },
    },
    colors: [PURPLE, isDark ? BROWN : GRAY, PINK],

    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "16%",
        borderRadiusApplication: "end",
      },
    },

    stroke: {
      width: [0, 0, 1], // bars=0, area=0, line=4
      curve: "smooth",
      dashArray: [0, 0, 5],
      lineCap: "round",
    },

    fill: {
      type: ["solid", "gradient", "solid"],
      opacity: [1, 0.2, 1],
      gradient: {
        shade: "dark",
        type: "vertical",
        opacityFrom: 0.15,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },

    grid: {
      borderColor: isDark ? DARK_GRID : LIGHT_GRID,
      strokeDashArray: 4,
    },

    markers: {
      size: 0,
      hover: { size: 6 },
    },

    xaxis: {
      type: "datetime",
      categories: labels,

      axisTicks: { show: false },
      axisBorder: {
        show: false,
      },

      labels: {
        style: {
          colors: isDark ? DARK_LABEL : LIGHT_LABEL,
          fontSize: "13px",
        },
      },
    },

    yaxis: {
      labels: {
        style: { colors: isDark ? DARK_LABEL : LIGHT_LABEL, fontSize: "13px" },
      },
    },

    tooltip: {
      theme: isDark ? "dark" : "light",
      shared: true,
      intersect: false,
      cssClass: "apex-tooltip",

      style: { fontSize: "12px", fontFamily: "Poppins" },
    },

    legend: {
      position: "top",
      fontSize: "13px",
      markers: {
        size: 5,
        strokeWidth: 0,
      },
      labels: {
        colors: isDark ? DARK_LABEL : LIGHT_LABEL,
      },
    },
  };
  return (
    <Card className={cn("p-4 rounded-sm gap-2 shadow-none", className)}>
      <CardHeader className="p-0 text-base font-semibold">{title}</CardHeader>
      <CardContent className="px-2 py-0">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={height}
        />
      </CardContent>
    </Card>
  );
};
