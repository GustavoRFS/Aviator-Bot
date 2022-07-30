import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

(async () => {
  const browser = await puppeteer.use(StealthPlugin()).launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--mute-audio"],
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

  while (true) {
    const od = await page.$(".coefficient.coefficient-md");

    console.log(od);

    if (od) {
      console.log(`OD de : ${(await od.getProperties()).values[0].value}`);
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  }
})();
