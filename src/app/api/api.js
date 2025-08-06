import axios from "axios";

import { restClient } from "@polygon.io/client-js";

export default function fetchStockData() {
  const apiKey = process.env.POLYGON_API_KEY;
  const rest = restClient(apikey, "https://api.polygon.io");

  async function example_listTickers() {
    try {
      const response = await rest.listTickers({
        market: "stocks",
        active: "true",
        order: "asc",
        limit: "100",
        sort: "ticker",
      });
      console.log("Response:", response);
    } catch (e) {
      console.error("An error happened:", e);
    }
  }

  example_listTickers();
}
