import { setupAction } from "@/actions/general/setup";
import Positions from "@/components/positions/positions";
import ShowFunds from "@/components/fundComponents/showFunds";
import PortfolioChartComponent from "@/components/portfolioChart/portfolioChartComponent";
import { chartAction } from "@/actions/chart/chartAction";

export default async function HomePage() {
	const chartSetup = await chartAction();


	const chartData = chartSetup.data;
	const chartConfig = chartSetup.config;
	
	if (!chartData || !chartConfig) {
		return (
			<>
				<ShowFunds />
				<div>{chartSetup.message ?? "No chart data available."}</div>
			</>
		);
	}

	const data = await setupAction();

	if (data.success === false) {
		return (
			<>
				<ShowFunds />
				<div>{data.message}</div>
			</>
		);
	}

	return (
		<>
			<ShowFunds />
			 <PortfolioChartComponent chartData={chartData} chartConfig={chartConfig} /> 
			<Positions data={data} /> 
		</>
	);
}
