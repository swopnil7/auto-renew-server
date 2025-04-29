const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 1. Go to login page
  await page.goto("https://dashboard.katabump.com/auth/login", { waitUntil: "networkidle2" });

  // 2. Login with email and password from GitHub secrets
  await page.type('input[name="email"]', process.env.KATABUMP_EMAIL);
  await page.type('input[name="password"]', process.env.KATABUMP_PASSWORD);

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  // 3. After login, go to dashboard
  await page.goto("https://dashboard.katabump.com/dashboard", { waitUntil: "networkidle2" });

  // 4. Click the “See” button (goes to server page)
  await page.waitForSelector('a[href*="/servers/edit?id=64630"]');
  await page.click('a[href*="/servers/edit?id=64630"]');

  await page.waitForNavigation({ waitUntil: "networkidle2" });

  // 5. Click the “Renew” button
  await page.waitForSelector('button.btn-outline-primary');
  await page.click('button.btn-outline-primary');

  console.log("✅ Server renewed successfully!");

  await browser.close();
})();
