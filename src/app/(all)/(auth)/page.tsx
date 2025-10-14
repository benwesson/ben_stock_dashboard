import { setup, SetupType } from "@/actions/general/setup";
import Positions from "@/components/positions/positions";
import ShowFunds from "@/components/fundComponents/showFunds";
import PortfolioChartComponent from "@/components/portfolioChart/portfolioChartComponent";
import { chartAction, chartConfigType, chartDataType } from "@/actions/chartAction";
type chartActionType = Awaited<
  | {
      success: boolean;
      message: string;
      config?: undefined;
      data?: undefined;
    }
  | {
      success: boolean;
      config: chartConfigType;
      data: chartDataType;
      message?: undefined;
    }
>;
export default async function HomePage() {
  const chartSetup: chartActionType = await chartAction();
  if (chartSetup.success === false) {
    return (
      <>
        <ShowFunds /> 
        <div>{chartSetup.message}</div>
      </>
    );
  }

  const data: SetupType = await setup();
  if (data.success === false ) {
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
      <PortfolioChartComponent chartConfig={chartSetup.config} chartData={chartSetup.data}  /> 
      <Positions data={data} />
    </>
  );
}
