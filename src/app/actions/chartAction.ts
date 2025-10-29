import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { fetchStock } from "@/actions/stock_api";
import { findDistinctTickers } from "@/actions/prisma_api";

/**
 * Chart config for ChartContainer.
 * - "price" is a meta key used by your chart library
 * - dynamic keys (e.g., AAPL, MSFT) provide label and color per series
 */
export interface ChartConfigType {
	price: { label: string };
	[key: string]: { label: string; color?: string };
}

// One chart row = one date with dynamic columns for each ticker:
// { date: "YYYY-MM-DD", AAPL: 123.4, MSFT: 400.1, ... }
export interface ChartRow {
	date: string;
	[key: string]: number | string;
}

export interface ChartAction {
	success: boolean;
	config?: ChartConfigType;
	data?: ChartRow[];
	message?: string;
}

/**
 * Build a ChartConfig with a rotating color palette and one entry per ticker.
 * The keys must match the data keys you'll render in the chart (e.g., AAPL).
 */
function createChartConfig(stockData: { ticker: string }[]) {
	// Define a small palette; rotate it to assign colors to series in order.
	const palette = [
		"var(--chart-1)",
		"var(--chart-2)",
		"var(--chart-3)",
		"var(--chart-4)",
		"var(--chart-5)",
	];

	const chartConfig: ChartConfigType = {
		price: { label: "Price USD" },
	};

	for (const stock of stockData) {
		const ticker = stock.ticker.toUpperCase();
		chartConfig[ticker] = { label: ticker, color: palette[0] };
		// Rotate palette so the next series gets the next color
		palette.push(palette.shift() as string);
	}

	console.log("Created chart config:", chartConfig);
	return { config: chartConfig };
}

/**
 * Merge per-ticker responses into a single time-aligned table of rows.
 * - One pass per ticker to fill a Map keyed by date.
 * - Dates are normalized to YYYY-MM-DD (drop time).
 * - Rows are sorted from oldest to newest for charting.
 */
function createChartData(
	stockData: { ticker: string }[],
	responses: Awaited<ReturnType<typeof fetchStock>>[]
): ChartRow[] {
	// byDate accumulates rows keyed by ISO date string
	const byDate = new Map<string, ChartRow>();

	stockData.forEach((s, i) => {
		const ticker = s.ticker.toUpperCase();

		// Defensive: ensure we have an array of { date, close } for this ticker
		const rows: Array<{ date: string; close: number }> = Array.isArray(
			responses[i]?.data
		)
			? responses[i].data
			: [];

		// Ensure chronological order (oldest -> newest) per ticker before merging
		rows.sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
		);

		for (const r of rows) {
			// Normalize to date-only key (drop time zone/time if any)
			const date = (r.date || "").split("T")[0];
			if (!date) continue;

			const close = Number(r.close ?? 0);

			// Seed the row for this date if not present
			if (!byDate.has(date)) byDate.set(date, { date });

			// Set the close under the ticker key for this date
			byDate.get(date)![ticker] = close;
		}
	});

	// Emit rows sorted by date ascending (required for most line charts)
	return Array.from(byDate.values()).sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
	);
}

/**
 * Server action to:
 * - read the current user's email from the session
 * - query distinct tickers the user owns
 * - fetch 100-day history per ticker (in parallel)
 * - produce a chart config and merged chart data for rendering
 */
export async function chartAction(): Promise<ChartAction> {
	// Get email from session (server-side only)
	const session = await getServerSession(authOptions);
	const email = session?.user?.email;

	if (!email) {
		return { success: false, message: "No email found" };
	}

	// Find distinct tickers for the user
	const stockData = await findDistinctTickers(email);
	console.log("User stock data:", stockData);

	// If no tickers, short-circuit (you could also check for length === 0)
	if (!stockData) {
		return { success: false, message: "No stocks found" };
	}

	// Fetch historical data once per distinct ticker (limit 100 points)
	const promises = stockData.map((s) =>
		fetchStock(s.ticker.toUpperCase(), 100)
	);
	const responses = await Promise.all(promises);

	// Build chart config and time-aligned data table
	const config = createChartConfig(stockData);
	console.log("Chart Config:", config);

	const data = createChartData(stockData, responses);
	console.log("Chart Data:", data);

	// Return payload shaped for your chart components
	return {
		success: true,
		config: config.config, // pass the config object (not the wrapper)
		data, // merged rows [{ date, AAPL, MSFT, ... }]
	};
}
