"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
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
import { useTranslations } from "next-intl"

type Stock = { id: number; ticker: string; quantity: number; price: number }
type StockPrices = { [key: string]: { data: { close: number; date: string }[] } }

export type PortfolioSeries = {
  name: string
  data: { date: string; value: number }[]
}

type Props = {
  stocks: Stock[]
  stockPrices: StockPrices
  mode?: "price" | "value" // price = close, value = close * totalQty per ticker
  title?: string
  description?: string
}

// Aggregate total quantity per ticker (handles multiple lots)
function aggregateQuantities(stocks: Stock[]) {
  const map: Record<string, number> = {}
  for (const s of stocks) {
    const t = s.ticker.toUpperCase()
    map[t] = (map[t] || 0) + Number(s.quantity || 0)
  }
  return map
}

// Build series from props
function buildPortfolioSeries(
  stocks: Stock[],
  stockPrices: StockPrices,
  mode: "price" | "value"
): PortfolioSeries[] {
  const qtyByTicker = aggregateQuantities(stocks)
  const tickers = Object.keys(qtyByTicker)

  return tickers
    .map((ticker) => {
      const prices = stockPrices[ticker]?.data || []
      const qty = qtyByTicker[ticker] || 0
      return {
        name: ticker,
        data: prices.map((d) => ({
          date: d.date,
          value: mode === "value" ? d.close * qty : d.close,
        })),
      }
    })
    // drop empty series
    .filter((s) => s.data.length > 0)
}

// Flatten [{name, data:[{date,value}]}] -> [{date, [name]: value, ...}, ...]
function flattenSeriesToRows(series: PortfolioSeries[]) {
  const dateMap = new Map<string, Record<string, any>>()
  for (const s of series) {
    for (const pt of s.data) {
      const key = pt.date
      if (!dateMap.has(key)) dateMap.set(key, { date: key })
      dateMap.get(key)![s.name] = pt.value
    }
  }
  return Array.from(dateMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
}

// Dynamic ChartConfig
function buildConfig(seriesNames: string[]): ChartConfig {
  const palette = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ]
  const cfg: ChartConfig = {
    views: { label: "Stock price" },
  } as ChartConfig

  seriesNames.forEach((name, i) => {
    // @ts-expect-error dynamic keys allowed by ChartConfig shape
    cfg[name] = { label: name, color: palette[i % palette.length] }
  })
  return cfg
}

export default function PortfolioChart({
  stocks,
  stockPrices,
  mode = "price",
  title,
  description,
}: Props) {
  const t = useTranslations("PortfolioChart") // client i18n
  const series = React.useMemo(
    () => buildPortfolioSeries(stocks, stockPrices, mode),
    [stocks, stockPrices, mode]
  )
  const seriesNames = React.useMemo(() => series.map((s) => s.name), [series])
  const rows = React.useMemo(() => flattenSeriesToRows(series), [series])
  const chartConfig = React.useMemo(() => buildConfig(seriesNames), [seriesNames])

  const [activeSeries, setActiveSeries] = React.useState<string>(seriesNames[0] || "")

  const totals = React.useMemo(() => {
    const agg: Record<string, number> = {}
    seriesNames.forEach((name) => {
      agg[name] = rows.reduce((a, r) => a + (Number(r[name]) || 0), 0)
    })
    return agg
  }, [rows, seriesNames])

  const titleText = title ?? t("title")
  const descText = description ?? t("Subtitle")

  if (seriesNames.length === 0) {
    return <div>No series to display.</div>
  }

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
                ${Math.round(totals[name] || 0).toLocaleString()}USD
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
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis tickMargin={8} tickLine={false} axisLine={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
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
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}