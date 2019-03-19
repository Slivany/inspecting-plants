const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const dbName = path.join(__dirname, 'plants.sqlite')
const db = new sqlite3.Database(dbName)

db.serialize(() => {
  const sql = `
  CREATE TABLE IF NOT EXISTS plants
    (id integer primary key, statePlant INTEGER, workerID INTEGER, temperature TEXT, humidity TEXT, dateTime TEXT)
  `
  db.run(sql)
})

class Plants {
  static all (callback) {
    db.all('SELECT * FROM plants', callback)
  }

  static create (plant, callback) {
    const sql = 'INSERT INTO plants(statePlant, workerID, temperature, humidity, dateTime) VALUES (?, ?, ?, ?, ?)'
    db.run(sql, plant.statePlant, plant.workerID, plant.temperature, plant.humidity, plant.dateTime, callback)
  }
}

module.exports = db
module.exports.Plants = Plants
