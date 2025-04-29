const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for GitHub Actions
  });
  const page = await browser.newPage();

  // Step 1: Log in
  await page.goto("https://dashboard.katabump.com/auth/login", { waitUntil: "networkidle2" });

  await page.type('input[type="email"]', process.env.KATABUMP_EMAIL);
  await page.type('input[type="password"]', process.env.KATABUMP_PASSWORD);
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  // Step 2: Go to server renew page
  await page.goto("https://dashboard.katabump.com/servers/edit?id=64630", { waitUntil: "networkidle2" });

  // Step 3: Click Renew
  await page.click('button.btn-outline-primary'); // Renew button
  console.log("✅ Renew clicked");

  await browser.close();
})();
