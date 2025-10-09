import { setup, SetupType } from "@/actions/general/setup";
import Positions from "@/components/positions/positions";
import ShowFunds from "@/components/fundComponents/showFunds";
import PortfolioChart from "@/components/portfolioChart/portfolioChart";
import { ChartAction,  ChartDataType } from "@/actions/chartAction";
export default async function HomePage() {
  const chartData: ChartDataType = await ChartAction();
  if (chartData.success === false) {
    return (
      <>
        <ShowFunds /> 
        <div>{chartData.message}</div>
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
      <PortfolioChart data={chartData} /> 
      <Positions data={data} />
    </>
  );
}
