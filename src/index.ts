import express from "express";
import Moralis from "moralis";
import cors from "cors";
import "dotenv/config";
import { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req: any, res: any) => {
  res.send("Hello World");
});

app.get(
  "/tokenPrice",
  async (
    req: Request<{}, {}, {}, { addressOne: string; addressTwo: string }>,
    res: Response
  ) => {
    const { query } = req;

    const responseOne = await Moralis.EvmApi.token.getTokenPrice({
      address: query.addressOne,
    });

    const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
      address: query.addressTwo,
    });

    const usdPrices = {
      tokenOne: responseOne.raw.usdPrice,
      tokenTwo: responseTwo.raw.usdPrice,
      ratio: responseOne.raw.usdPrice / responseTwo.raw.usdPrice,
    };

    // pretty print the response
    res.json(usdPrices);
  }
);

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening: http://localhost:${port}`);
  });
});
