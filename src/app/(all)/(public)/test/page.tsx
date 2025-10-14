import ChartTest from "@/components/chartTest"
import { testChartAction } from "@/actions/testChartAction"
export default async function Page() {
  const chartData = await testChartAction()
  return (
    <div>
      <h1>Test Page</h1>
      {/* <ChartTest chartData={chartData} /> */}
    </div>
  )
}
