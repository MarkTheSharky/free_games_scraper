const axios = require("axios");
const cheerio = require("cheerio");

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

    const post = { service: "psplus", postID: "", imgURL: "", postURL: "", postText: "", };
    post.postID = $(articles).attr('id')
    post.imgURL = $(articles).find('a').find('div').find('img').attr('data-src');
    post.postURL = $(articles).children().attr('href');
    post.postText = $(articles).find('a').find('div').find('img').attr('alt');
    
    
    const previous = lastPost ? lastPost.postID : null
    if (post.postID !== previous) {
      return post
    }
    

  } catch (err) {
    console.error(err);
  }
}

// Invoke the above function
// scrapeData();

exports.scrapeData = scrapeData