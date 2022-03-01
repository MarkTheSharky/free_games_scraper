const axios = require("axios");
const cheerio = require("cheerio");
const discordWebhook = process.env['discordWebhook']


// URL of the page we want to scrape
const url = "https://blog.playstation.com/category/ps-plus/";


// Async function which scrapes the data
async function scrapeData(lastPost) {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the article tags
    const articles = $("article");

    const post = { service: "psplus", postID: "", imgURL: "", postURL: "", title: "", description: "" };
    
    post.postID = $(articles).attr('id')
    post.imgURL = $(articles).find('a').find('div').find('img').attr('data-src');
    post.postURL = $(articles).children().attr('href');
    const titleString = $(articles).find('a').find('div').find('img').attr('alt');
    const colonIndex = titleString.indexOf(':')
    post.title = titleString.slice(0, colonIndex).replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    post.description = titleString.slice(colonIndex + 2)
    
    const obj = {
      "username": "Playstation Plus",
      "embeds": [
        {
          "title": post.title,
          "url": post.postURL,
          "description": post.description,
          "color": 15979324,
          "thumbnail": {
            "url": "https://gmedia.playstation.com/is/image/SIEPDC/ps-plus-blue-bag-icon-01-22sep20?$200px--t$"
          },
          "image": {
            "url": post.imgURL
          }
        }
      ]
    }

    function validatePSPlusPost() {
      const title = post.title.slice(0, 26).toLowerCase()
      return title === 'playstation plus games for'
    }

    const previous = lastPost ? lastPost.postID : null
    if (post.postID !== previous && validatePSPlusPost()) {
      axios({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(obj),
        url: discordWebhookTEST,
      });
      return post
    }



  } catch (err) {
    console.error(err);
  }
}

exports.scrapeData = scrapeData
