import Buy from "@/components/buy/buy";
import Sell from "@/components/sell/sell";
import styles from "./trade.module.css"; 
export default function TradePage() {
  return (
    <div>
      <div className={styles.trade_container}>
       
        <div className={styles.buy}> 
          <Buy />
        </div> 
        <div className={styles.sell}>
           <Sell />
        </div>
       
      </div>
    </div>
  );
}
