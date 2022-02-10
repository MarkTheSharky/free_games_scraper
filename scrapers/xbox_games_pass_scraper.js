const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// URL of the page we want to scrape
const url = "https://news.xbox.com/en-us/xbox-game-pass/";

// Async function which scrapes the data
async function scrapeData() {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the article tags
    const articles = $('div[class="media feed"]');

    const post = { postID: "", imgURL: "", postURL: "", postText: "", };
    post.postID = $(articles).find('div[class="media-body feed__body"] > p[class="feed__date small"] > time').attr('datetime')
    post.imgURL = $(articles).find('div[class="media-image feed__image"] > a > img').attr('src');
    post.postURL = $(articles).find('div[class="media-image feed__image"] > a').attr('href');
    post.postText = $(articles).find('div[class="media-image feed__image"] > a').attr('aria-label');
    // console.dir(post);

    const isNewGamesPost = post.postText.includes('Coming Soon to Xbox Game Pass:')

    if (isNewGamesPost) {
      return post
    }

  } catch (err) {
    console.error(err);
  }
}
// Invoke the above function
scrapeData();