const Sequelize = require('sequelize')

const psplus = require('./scrapers/psplus_scraper')


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
  postText: Sequelize.TEXT
})

sequelize.sync()
  .then(() => {
    console.log(`Database and tables created!`)
  })


async function runPsPlusUpdater() {
  const lastPost = await freeGameEntry.findOne({ where: {service: 'psplus'}, order: [ [ 'id', 'DESC' ]]})
  const result = await psplus.scrapeData(lastPost)
  if (result) {
    freeGameEntry.create(result)
  }
}

runPsPlusUpdater()