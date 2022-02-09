const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// URL of the page we want to scrape
const url = "https://blog.playstation.com/category/ps-now/";

// Async function which scrapes the data
async function scrapeData() {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the article tags
    const articles = $("article");

    const post = { postID: "", imgURL: "", postURL: "", postText: "", };

    post.postID = $(articles).attr('id')
    post.imgURL = $(articles).find('a').find('div').find('img').attr('data-src');
    post.postURL = $(articles).children().attr('href');
    post.postText = $(articles).find('a').find('div').find('img').attr('alt');
    // console.dir(post);

// Method to log 'post' result to database

  } catch (err) {
    console.error(err);
  }
  
}
// Invoke the above function
scrapeData();