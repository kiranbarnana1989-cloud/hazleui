const puppeteer = require('puppeteer');

(async () => {
  const URL = process.env.TEST_URL || 'http://localhost/hazleui/';
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(URL, { waitUntil: 'networkidle2' });

    // Wait for registration password input to appear
    await page.waitForSelector('#reg-password', { timeout: 5000 });

    // Type a password and a different confirm value
    await page.focus('#reg-password');
    await page.keyboard.type('Aa1!passw');
    await page.focus('#reg-confirm_password');
    await page.keyboard.type('Different1!');

    // Give small time for event handlers
    await page.waitForTimeout(200);

    // Check the confirm error is visible / has text
    const errText1 = await page.$eval('#reg-confirm_password-error', el => el.textContent.trim());
    if (!errText1) {
      console.error('FAIL: Expected mismatch error to be shown when confirm differs');
      await browser.close();
      process.exit(2);
    }
    console.log('OK: Mismatch shows error:', errText1);

    // Replace confirm with matching value
    await page.click('#reg-confirm_password', { clickCount: 3 });
    await page.keyboard.type('Aa1!passw');
    await page.waitForTimeout(200);

    const errText2 = await page.$eval('#reg-confirm_password-error', el => el.textContent.trim());
    const hiddenClass = await page.$eval('#reg-confirm_password-error', el => el.classList.contains('hidden'));

    if (errText2 !== '' && !hiddenClass) {
      console.error('FAIL: Expected no error when passwords match, got:', errText2);
      await browser.close();
      process.exit(3);
    }

    console.log('OK: Matching passwords clear error');
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('ERROR during test:', err);
    await browser.close();
    process.exit(1);
  }
})();
