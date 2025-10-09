import {setup, SetupType} from "@/actions/general/setup";
import Positions from "@/components/positions/positions";

export default async function HomePage() {
const data: SetupType = await setup();
if (data.success === false) {
    return <div>{data.message}</div>;
  }

  return (
    <>
      <Positions data={data} />
    </>
  );
}





