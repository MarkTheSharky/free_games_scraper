const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// URL of the page we want to scrape
const url = "https://blog.playstation.com/category/ps-plus/";

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

//To populate initial database
    // const posts = [];
    // articles.each((index, element) => {
    //   const post = { postID: "", imgURL: "", postURL: "", postText: "", };
    //   // let postID = $(element).attr('id')

    //   post.postID = $(element).attr('id')
    //   post.imgURL = $(element).find('a').find('div').find('img').attr('data-src');
    //   post.postURL = $(element).children().attr('href');
    //   post.postText = $(element).find('a').find('div').find('img').attr('alt');
    //   // post.postText2 = $(articles).find(`.${postID} > div > h2`).text().trim();

    //   posts.push(post);
    // });
    // console.dir(posts);

//Write data to file
    // Write countries array in countries.json file
    // fs.writeFile("posts.json", JSON.stringify(posts, null, 2), (err) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //   console.log("Successfully written data to file");
    // });

  } catch (err) {
    console.error(err);
  }
}
// Invoke the above function
scrapeData();