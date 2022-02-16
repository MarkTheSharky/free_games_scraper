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


// EMBED POST TEMPLATE
//
// {
//   "username": "Playstation Plus",
//   "embeds": [
//     {
//       "title": "Free Playstation Plus Games",
//       "url": "https://blog.playstation.com/2022/01/26/playstation-plus-games-for-february-ea-sports-ufc-4-planet-coaster-console-edition-tiny-tinas-assault-on-dragon-keep-a-wonderlands-one-shot-adventure/",
//       "description": "PlayStation Plus games for February: EA Sports UFC 4, Planet Coaster: Console Edition, Tiny Tina’s Assault on Dragon Keep: A Wonderlands One-shot Adventure",
//       "color": 15258703,
//       "thumbnail": {
//         "url": "https://gmedia.playstation.com/is/image/SIEPDC/ps-plus-blue-bag-icon-01-22sep20?$200px--t$"
//       },
//       "image": {
//         "url": "https://blog.playstation.com/tachyon/2022/01/5a1b94ee8548fa3391124c09f9eab6dc6838b8ef.jpg?resize=1088%2C612&crop_strategy=smart"
//       }
//     }
//   ]
// }