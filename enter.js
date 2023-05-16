const useProxy = require('puppeteer-page-proxy');
const { Webhook, MessageBuilder } = require('discord-webhook-node');
const fs = require('fs');
const clc = require('cli-color');
const { Page } = require('puppeteer');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());


function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }



const enterSweep = async (fn, ln, email, gpt) => {

  const hook = new Webhook("***ENTER WEBHOOK HERE***");

  const embed = new MessageBuilder()
  .setTitle('Raffle Successfully Entered!')
  .addField('Email', `${email}`)
  .addField('Name', `${fn} ${ln}`)
  .addField('GPT answer', `${gpt}`)
  .setColor('#00b0f4')
  .setThumbnail('https://jtdtcwvg.tinifycdn.com/media/catalog/product/cache/57016e64bb9fc84319043b9d1ea53342/p/e/perfectdraftpro.png')
  .setFooter('Beer Raffles v1.0.0', 'https://cdn.discordapp.com/embed/avatars/0.png')
  .setTimestamp();


         let proxies = fs.readFileSync('proxies.txt').toString().split("\n");

         let i = Math.floor(Math.random() * proxies.length);
     
         let _proxy = proxies[i];     
     
         let proxySplit = _proxy.split(':');
     
         let proxy = 'http://' + proxySplit[2] + ':' + proxySplit[3] + '@' + proxySplit[0] + ':' + proxySplit[1]; 
     
         console.log(clc.cyan('Proxy has been set to: ' + _proxy));

         const browser = await puppeteer.launch({
          headless: true,
          executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
          defaultViewport: null,
          args: [
              "--disable-blink-features=AutomationControlled"
          ],
      });

      const page = await browser.newPage();
    
      await useProxy(page, proxy);

try {

      await page.goto('https://uk.perfectdraft.com/win-coronation/');

      //wait for cookie popup

      await page.$('#onetrust-accept-btn-handler', {timeout: 20000});

      console.log(clc.cyan('Page loaded successfully!'));

      await delay(4000);

}
catch (err) {


  await browser.close();

  console.log(clc.red('Error on page load'))



}

try {

  await delay(500);

  await page.click('#onetrust-accept-btn-handler');



}
catch (err) {

  await browser.close();

  console.log(clc.red('Error accepting cookies'))



}


try {

  await page.type('#name', `${fn + ' ' + ln}`, {delay: 100});

  console.log(clc.cyan('Entered Name'));



}
catch (err) {

  await browser.close();

  console.log(clc.red('Error entering name'))



}


try {

  await page.type('#email', `${email}`, {delay: 100});

  console.log(clc.cyan('Entered Email'));

  await delay(500);

}
catch (err) {

  await browser.close();

  console.log(clc.red('Error entering email'))



}

try {

  await page.type('#tell_us__about_your_coronation_plans', `${gpt}`);

  console.log(clc.cyan('Entered Coronation Plans'));

  await delay(1000);

}
catch {

  await browser.close();

  console.log(clc.red('Error entering coronation plans'))



}

try {

  await page.click('#agegate_i_confirm_i_am_over_18_and_accept_the_a_target_blank_href_https_www_perfectdraft_com_en_gb_terms_and_conditions_terms_and_conditions_a_and_a_target_blank_href_https_www_perfectdraft_com_en_gb_privacy_policy_privacy_policy_a');

  console.log(clc.cyan('Accepted Terms & Conditions'));

  await delay(500);

}
catch (err) {

  await browser.close();

  console.log(clc.red('Error accepting terms & conditions'))



}

try {

  await page.click('#consent_i_consent_to_receive_email_communications_to_get_first_dibs_on_our_latest_products_and_offers_you_can_unsubscribe_at_any_time_read_our_a_target_blank_href_https_www_perfectdraft_com_en_gb_privacy_policy_privacy_policy_a_for_more_information_see_our_a_target_blank_href_https_www_perfectdraft_com_en_gb_terms_and_conditions_full_terms_and_conditions_here_a');

  await delay(500);

  console.log(clc.cyan('Accepted Email Communications'));

}
catch {

  await browser.close();

  console.log(clc.red('Error accepting email communications'))



}

try {

  await page.click('#lp-pom-button-19');

}
catch (err) {

  await browser.close();

  console.log(clc.red('Error clicking submit button'))



}

try {

  await page.$('#lp-pom-text-7', {timeout: 20000})

  console.log(clc.green('Entered Successfully!'));

  await delay(5500);

  browser.close();

hook.send(embed);


}
catch (err) {

  await browser.close();

  console.log(clc.red('Error entering'))



}

}

module.exports = enterSweep;s