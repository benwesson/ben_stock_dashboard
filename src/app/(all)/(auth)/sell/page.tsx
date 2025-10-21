import SellComponent from "@/components/sellPage/SellComponent";
import ShowFunds from "@/components/fundComponents/showFunds";
import { setupAction } from "@/actions/general/setup";

export default async function SellTest() {
  const test = await setupAction();

  console.log("Test:", test);

  if (test.success === false || !test.data || test.data.length === 0) {
    return (
      <>
        <ShowFunds />
        <div>{test.message}</div>
      </>
    );
  }

  return (
    <>
      <ShowFunds />
      <SellComponent stockData={test.data} />
    </>
  );
}
