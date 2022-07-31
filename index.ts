import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { RoundModel } from "./src/entities/round";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

import "./src/seeds/simulations";
import { SimulationsModel } from "./src/entities/simulations";

(async () => {
  const browser = await puppeteer.use(StealthPlugin()).launch({
    args: ["--mute-audio"],
  });

  const page = await browser.newPage();
  await page.goto("https://www.rivalry.com/pt/casino/aviator");

  await page.waitForTimeout(5000);

  const googleLoginButton = await page.$(".social-provider-button.google");
  await googleLoginButton?.click();

  await page.waitForTimeout(5000);

  const googleEmailInput = await page.$("input");
  await googleEmailInput?.type(String(process.env.GOOGLE_EMAIL));
  await googleEmailInput?.press("Enter");

  await page.waitForTimeout(5000);

  const googlePasswordInput = await page.$("input");
  await googlePasswordInput?.type(String(process.env.GOOGLE_PASSWORD));
  await googlePasswordInput?.press("Enter");

  await page.waitForTimeout(15000);

  if (
    page.url() === "https://www.rivalry.com/pt/casino/aviator?utm_nooverride=1"
  )
    console.log("Login com sucesso");

  const iframes = await page.$$("iframe");

  const aviatorFrame = await iframes?.[0]?.contentFrame();

  let lastTimeEntered = Date.now();

  while (true) {
    const od = await aviatorFrame?.$(".flew-coefficient.ng-star-inserted");

    const timeNow = Date.now();
    if (od && lastTimeEntered + 6000 < timeNow) {
      lastTimeEntered = timeNow;
      const odValue = await (await od?.getProperty("innerText")).jsonValue();

      const odValueNumber = Number(
        String(odValue)
          .replace(",", "")
          .replace('"', "")
          .replace('"', "")
          .replace("x", "")
      );

      if (!isNaN(odValueNumber)) {
        const roundData = (
          await RoundModel.create({ od: odValueNumber, earns: [] })
        ).toObject();

        const simulations = await SimulationsModel.find();

        simulations.forEach((simulation) => {
          const simulationData = simulation.toObject();

          if (simulationData.currentBalance < simulationData.valueBet) return;

          const balanceBefore = simulationData.currentBalance;

          const multipliedProfit = Math.floor(
            simulationData.currentBalance / simulationData.initialBalance
          );

          const multiplier = multipliedProfit >= 2 ? multipliedProfit - 1 : 1;

          const betWithMultipliers =
            multipliedProfit >= 2
              ? simulationData.valueBetMultiplier *
                multiplier *
                simulationData.valueBet
              : simulationData.valueBet;

          simulationData.currentBalance -= betWithMultipliers;

          if (roundData.od >= simulationData.odBet) {
            simulationData.currentBalance +=
              betWithMultipliers * simulationData.odBet;

            console.log({ simulationData });
          }
          simulationData.history.push({
            balanceBefore,
            balanceAfter: simulationData.currentBalance,
            od: roundData.od,
          });

          SimulationsModel.findByIdAndUpdate(
            simulationData._id,
            simulationData
          ).catch(console.error);
        });
      } else {
        console.error(`Não foi possível obter o valor do OD ${odValue}`);
      }
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  }
})();
