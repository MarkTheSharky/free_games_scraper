const Sequelize = require('sequelize')
const cron = require('node-cron')
const keepAlive = require("./server/server")

const psplus = require('./scrapers/psplus_scraper')
const psnow = require('./scrapers/psnow_scraper')
const xbox = require('./scrapers/xbox_games_pass_scraper')

// Set up Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
  })

sequelize.authenticate()
  .then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.log('Unable to connect: ', err);
})

const freeGameEntry = sequelize.define('games', {
  service: Sequelize.STRING,
  postID: Sequelize.STRING,
  imgURL: Sequelize.TEXT,
  postURL: Sequelize.TEXT,
  title: Sequelize.TEXT,
  description: Sequelize.TEXT
})

sequelize.sync()
  .then(() => {
    console.log(`Database and tables created!`)
  })


  
// Run Playstation Plus Updater
async function runPsPlusUpdater() {
  const lastPost = await freeGameEntry.findOne({ where: {service: 'psplus'}, order: [ [ 'id', 'DESC' ]]})
  const result = await psplus.scrapeData(lastPost)

  if (result) {
    freeGameEntry.create(result)
  }
}

// Run Playstation Now Updater
async function runPsNowUpdater() {
  const lastPost = await freeGameEntry.findOne({ where: {service: 'psnow'}, order: [ [ 'id', 'DESC' ]]})
  const result = await psnow.scrapeData(lastPost)

  if (result) {
    freeGameEntry.create(result)
  }
}

// Run Xbox Games Pass Updater
async function runXboxGamesPassUpdater() {
  const lastURL = await freeGameEntry.findOne({ where: {service: 'xboxgamespass'}, order: [ [ 'postURL', 'DESC' ]]})
  const result = await xbox.scrapeData(lastURL)

  if (result) {
    freeGameEntry.create(result)
  }
}

runPsPlusUpdater()
runPsNowUpdater()
runXboxGamesPassUpdater()

cron.schedule('5 * * * *', () => {
  console.log(new Date)
  runPsPlusUpdater()
  runPsNowUpdater()
  runXboxGamesPassUpdater()
})

cron.schedule('35 * * * *', () => {
  console.log(new Date)
  runPsPlusUpdater()
  runPsNowUpdater()
  runXboxGamesPassUpdater()
})

keepAlive()