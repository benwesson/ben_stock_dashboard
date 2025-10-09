
import SellComponent from "@/components/sellPage/SellComponent";
import ShowFunds from "@/components/fundComponents/showFunds";
import { setup, SetupType } from "@/actions/general/setup";

export default async function SellTest() {
  const test: SetupType = await setup();
  console.log("Test:", test);

 if(test.success === false){
    return <div>{test.message}</div>
 }

  return (
    <>
      <ShowFunds />
      <SellComponent stockData={test}  />
    </>
  );
}

