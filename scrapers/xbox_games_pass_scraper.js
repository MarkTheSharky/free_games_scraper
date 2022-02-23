const axios = require("axios");
const cheerio = require("cheerio");
const discordWebhook = process.env['discordWebhook']


// URL of the page we want to scrape
const url = 'https://news.xbox.com/en-us/'


// Async function which scrapes the data
async function scrapeData(lastURL) {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the article tags
    const articles = $('div[class="speedbump__post speedbump--solid"]');

    const post = { service: "xboxgamespass", postID: "NA", imgURL: "", postURL: "", title: "", description: "" };

    
    post.imgURL = $(articles).find('div[class="speedbump__image"] > a > img').attr('src');
    post.postURL = $(articles).find('div[class="speedbump__image"] > a').attr('href');
    const titleString = $(articles).find('div[class="speedbump__image"] > a').attr('aria-label');
    const colonIndex = titleString.indexOf(':')
    post.title = titleString.slice(0, colonIndex).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    post.description = titleString.slice(colonIndex + 2)

    const obj = {
      "username": "Xbox Game Pass",
      "embeds": [
        {
          "title": post.title,
          "url": post.postURL,
          "description": post.description,
          "color": 1080080,
          "thumbnail": {
            "url": "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RW4ESm?ver=c63e"
          },
          "image": {
            "url": post.imgURL
          }
        }
      ]
    }

    function validateXboxGamesPassPost() {
      const title = post.title.slice(0, 29).toLowerCase()
      return title === 'coming soon to xbox game pass'
    }

    const previous = lastURL ? lastURL.postURL : null
    if (post.postURL !== previous && validateXboxGamesPassPost()) {
      axios({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(obj),
        url: discordWebhook,
      });
      return post
    }

  } catch (err) {
    console.error(err);
  }
}

exports.scrapeData = scrapeData