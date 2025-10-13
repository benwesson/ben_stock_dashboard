import ChartTest from "@/components/chartTest"
import { ChartAction } from "@/actions/chartAction"
export default async function Page() {
  const chartData = await ChartAction()
  return (
    <div>
      <h1>Test Page</h1>
      <ChartTest chartData={chartData} />
    </div>
  )
}
