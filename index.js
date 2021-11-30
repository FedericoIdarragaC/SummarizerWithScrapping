const puppeteer = require('puppeteer');
const fs = require('fs');
const summarize = require('./summary');


(async () => {
  while(1){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log("Choose the page that you want to scrapping to: ");

    let rawdata = fs.readFileSync('pages.json');
    let pages = JSON.parse(rawdata).pages;

    for (let i = 0; i < pages.length; i++) {
      console.log(i,": ",pages[i].name);
    }
    const prompt = require('prompt-sync')();
    let pageId = prompt("Choose: ");
    let senteces = prompt("Sentences number: ")
    console.clear()
    console.log("Scrapping loading...");

    await page.goto(pages[pageId].link);
    text = ''
    pages[pageId].selectors.forEach(async (selector) => {
      paragraph = await page.$eval(selector,
        text => text.innerText
        );
        text = text + ' ' + paragraph;
    });
      
    await page.waitForTimeout(2000);
    console.clear()
    console.log("Scrapping Done:");
    console.log("The summary of" ,pages[pageId].name,":");
    
    
    summary = summarize(text, senteces, 20);
    console.log("Summary: ",summary.text)
    console.log("Keywords: ",summary.keywords)

    prompt("Continue... ")
    console.clear()
  }
})();