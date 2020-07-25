module.exports.runCrawler = async () => {
    console.log(`Running crawler with ${process.env.USERNAME} - ${process.env.PASSWORD}`);

    const puppeteer = require('puppeteer');

    const browser = await puppeteer.launch({
        headless: false,
        timeout: 999999999
    });
    const page = await browser.newPage();

    console.log(`Visiting page...`);
    await page.goto(`https://sso.online.tableau.com/public/idp/SSO`);
    
    await page.waitForXPath('//*[@id="email"]');
    
    console.log(`Typing email`);
    await page.click('#email');
    await page.keyboard.type(process.env.USERNAME);
    
    console.log(`Typing password`);
    await page.click('#password');
    await page.keyboard.type(process.env.PASSWORD);
    
    console.log(`Logging in...`);
    await page.click('#login-submit');
    
    await page.waitForXPath('//*[@id="ng-app"]');
    
    console.log(`Getting cookies`);
    const cookies = await page.cookies();

    console.log(`Closing browser`);
    browser.close();

    return cookies;
}
