import { setupAction } from "@/actions/general/setup";
import Positions from "@/components/positions/positions";
import ShowFunds from "@/components/fundComponents/showFunds";
import PortfolioChartComponent from "@/components/portfolioChart/portfolioChartComponent";
import { chartAction } from "@/actions/chart/chartAction";

export default async function HomePage() {
	const chartSetup = await chartAction();

	if (chartSetup.success === false) {
		return (
			<>
				<ShowFunds />
				<div>{chartSetup.message}</div>
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
			<PortfolioChartComponent
				chartConfig={chartSetup.config}
				chartData={chartSetup.data}
			/>
			<Positions data={data} />
		</>
	);
}
