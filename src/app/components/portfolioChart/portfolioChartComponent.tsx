"use client"
import { useTranslations } from "next-intl"
import { useMemo, useState, useEffect } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { chartConfigType, chartDataType, chartRow } from "@/actions/chartAction"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An interactive line chart"

export default function PortFolioChartComponent( { chartConfig, chartData }: { chartConfig: chartConfigType; chartData: chartDataType } ) {
  const t = useTranslations("PortfolioChart")
  // Series keys are all keys except the meta key "price"
  const seriesKeys = useMemo(
    () => Object.keys(chartConfig).filter((k) => k !== "price"),
    [chartConfig]
  )

  const [activeSeries, setActiveSeries] = useState<string>(
    seriesKeys[0] || ""
  )

  useEffect(() => {
    // reset active series if config changes
    if (seriesKeys.length && !seriesKeys.includes(activeSeries)) {
      setActiveSeries(seriesKeys[0])
    }
  }, [seriesKeys, activeSeries])

  const totals = useMemo(() => {
    const agg: Record<string, number> = {}
    for (const key of seriesKeys) {
      agg[key] = (chartData ?? []).reduce(
        (acc, row) => acc + Number((row as chartRow)[key] ?? 0),
        0
      )
    }
    return agg
  }, [chartData, seriesKeys])

  if (!seriesKeys.length) {
    return <div>No series to display.</div>
  }

  return (
    <Card className="py-4 sm:py-0 mt-8">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("subtitle")}</CardDescription>
        </div>
        <div className="flex overflow-x-auto">
          {seriesKeys.map((key) => (
            <button
              key={key}
              data-active={activeSeries === key}
              className="data-[active=true]:bg-muted/50 flex min-w-36 flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveSeries(key)}
            >
              <span className="text-muted-foreground text-xs">
                {chartConfig[key]?.label ?? key}
              </span>
              <span className="text-lg leading-none font-bold sm:text-3xl">
                {Math.round(totals[key] || 0).toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig as unknown as ChartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value as string).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeSeries}
                  labelFormatter={(value) =>
                    new Date(value as string).toLocaleDateString("en-US", {
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
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
