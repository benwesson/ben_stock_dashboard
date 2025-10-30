"use client";
import { ChartRow, ChartConfigType } from "@/actions/chart/chartAction";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { useTranslations } from "next-intl";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive line chart";

export default function PortfolioChartComponent({
	chartData,
	chartConfig,
}: {
	chartData: ChartRow[];
	chartConfig: ChartConfigType;
}) {
	chartConfig satisfies ChartConfig;
	const t = useTranslations("PortfolioChart");
	//Create key for each item in chartConfig, to have the first stock be selcted by default we use index 1 becuase index 0 is price
	const chartKeys = useMemo(
		() => Object.keys(chartConfig) as (keyof typeof chartConfig)[],
		[chartConfig]
	);
	const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>(
		chartKeys[1]
	);

	const total = useMemo(() => {
		const result: Record<string, number> = {};
		for (const key of chartKeys) {
			result[key] = chartData.reduce<number>(
				(acc, curr) => acc + Number(curr[key] ?? 0),
				0
			);
		}
		return result;
	}, [chartData, chartKeys]);

	return (
		<Card className="py-4 sm:py-0 mt-8">
			<CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
					<CardTitle>{t("title")}</CardTitle>
					<CardDescription>{t("subtitle")}</CardDescription>
				</div>
				<div className="flex flex-nowrap overflow-x-auto pb-3 sm:px-0 sm:pb-0">
					{chartKeys.slice(1).map((key) => {
						const chart = key as keyof typeof chartConfig;
						return (
							<button
								key={chart}
								data-active={activeChart === chart}
								className="data-[active=true]:bg-muted/50 flex flex-none min-w-[160px] flex-col justify-center gap-1 border-l border-t px-6 py-4  first:border-l-0 sm:border-t-0 sm:px-8 sm:py-6 "
								onClick={() => setActiveChart(chart)}
							>
								<span className="text-muted-foreground text-xs">
									{chartConfig[chart].label}
								</span>
								<span className="text-lg leading-none font-bold sm:text-3xl">
									{total[
										key as keyof typeof total
									].toLocaleString()}
								</span>
							</button>
						);
					})}
				</div>
			</CardHeader>
			<CardContent className="px-2 sm:p-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[250px] w-full"
				>
					<LineChart
						accessibilityLayer
						data={chartData}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								});
							}}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={8}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									className="w-[150px]"
									nameKey="price"
									labelFormatter={(value) => {
										return new Date(
											value
										).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										});
									}}
								/>
							}
						/>
						<Line
							dataKey={activeChart}
							type="monotone"
							stroke={`var(--color-${activeChart})`}
							strokeWidth={2}
							dot={false}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
