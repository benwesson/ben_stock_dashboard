"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartDataType } from "@/actions/chartAction";

type Props = {
  data: ChartDataType;
  title?: string;
  description?: string;
};

// Build table rows: [{ date, TICKER1: close, TICKER2: close, ... }, ...]
function buildRows(record: Record<string, { dates: string[]; closes: number[] }>) {
  const byDate = new Map<string, Record<string, any>>();
  for (const [ticker, series] of Object.entries(record)) {
    const len = Math.min(series.dates.length, series.closes.length);
    for (let i = 0; i < len; i++) {
      const date = series.dates[i];
      const close = Number(series.closes[i] ?? 0);
      if (!byDate.has(date)) byDate.set(date, { date });
      byDate.get(date)![ticker] = close;
    }
  }
  return Array.from(byDate.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

function buildConfig(seriesNames: string[]): ChartConfig {
  const palette = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
  const cfg: ChartConfig = { views: { label: "Series" } } as ChartConfig;
  seriesNames.forEach((name, i) => {
    // @ts-expect-error dynamic keys allowed by ChartConfig shape
    cfg[name] = { label: name, color: palette[i % palette.length] };
  });
  return cfg;
}

export default function PortfolioChart({ data, title, description }: Props) {
  const t = useTranslations("PortfolioChart");

  if (!data || (("success" in data) && data.success === false)) {
    const msg = (data as any)?.message || "Failed to load chart data.";
    return <div>{msg}</div>;
  }

  // success path
  const record = data.data;
  const seriesNames = Object.keys(record);
  if (seriesNames.length === 0) {
    return <div>No series to display.</div>;
  }

  const rows = React.useMemo(() => buildRows(record), [record]);
  const chartConfig = React.useMemo(() => buildConfig(seriesNames), [seriesNames]);
  const [activeSeries, setActiveSeries] = React.useState<string>(seriesNames[0]);

  const totals = React.useMemo(() => {
    const agg: Record<string, number> = {};
    seriesNames.forEach((name) => {
      agg[name] = rows.reduce((a, r) => a + (Number(r[name]) || 0), 0);
    });
    return agg;
  }, [rows, seriesNames]);

  const titleText = title ?? t("title", { default: "Portfolio" });
  const descText = description ?? t("Subtitle", { default: "Historical close per ticker" });

  return (
    <Card className="py-4 sm:py-0 mt-8 mb-8">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>{titleText}</CardTitle>
          <CardDescription>{descText}</CardDescription>
        </div>
        <div className="flex overflow-x-auto">
          {seriesNames.map((name) => (
            <button
              key={name}
              data-active={activeSeries === name}
              className="data-[active=true]:bg-muted/50 flex min-w-36 flex-1 flex-col justify-center gap-1 border-t px-4 py-3 text-left even:border-l sm:border-t-0 sm:border-l sm:px-6 sm:py-4"
              onClick={() => setActiveSeries(name)}
              title={chartConfig[name]?.label ?? name}
            >
              <span className="text-muted-foreground text-xs">
                {chartConfig[name]?.label ?? name}
              </span>
              <span className="text-lg leading-none font-bold sm:text-2xl">
                ${Math.round(totals[name] || 0).toLocaleString()} USD
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <LineChart accessibilityLayer data={rows} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  nameKey={activeSeries}
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Line
              dataKey={activeSeries}
              type="monotone"
              stroke={`var(--color-${activeSeries})`}
              strokeWidth={2}
              dot={rows.length <= 64}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
