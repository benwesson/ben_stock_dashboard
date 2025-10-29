import PortFolioChartComponent from "@/components/portfolioChart/portfolioChartComponent";
import { chartAction } from "@/actions/chart/chartAction";
export default async function Page() {
	const chartSetup = await chartAction();

	if (chartSetup.success === false) {
		return (
			<div>
				<h1>Error loading chart data</h1>
			</div>
		);
	}
	return (
		<div>
			<h1>Test Page</h1>
			{chartSetup.config && chartSetup.data ? (
				<PortFolioChartComponent
					chartConfig={chartSetup.config}
					chartData={chartSetup.data}
				/>
			) : (
				<div>
					<h2>Chart data is unavailable.</h2>
				</div>
			)}
		</div>
	);
}
