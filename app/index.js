'use strict'
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Plants = require('../db/db').Plants
const moment = require('moment')

const sensorLib = require('node-dht-sensor')
const Gpio = require('onoff').Gpio

sensorLib.initialize(22, 12)
const led = new Gpio(4, 'out')

const app = express()
const port = 3000

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, '../views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, '../views'))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, '../public')))

app.get('/', (request, response, next) => {
  let readout = sensorLib.read()
  response.render('form', {
    title: 'Inspecting plants',
    humidity: readout.humidity.toFixed(2) + '%',
    temperature: readout.temperature.toFixed(2) + '°C',
    // Using Moment to easily format current date for datetime-local in HTML file
    dateTime: moment().format(moment.HTML5_FMT.DATETIME_LOCAL)
  })
})

app.post('/plants', (request, response, next) => {
  const plant = {
    statePlant: request.body.statePlant,
    workerID: request.body.workerID,
    temperature: request.body.temperature,
    humidity: request.body.humidity,
    dateTime: request.body.dateTime
  }
  Plants.create(plant, (err, plant) => {
    if (err) return next(err)
    // Successfully saved
    blinkingLed(2)
    response.redirect('/plants')
  })
})

app.get('/plants', (request, response, next) => {
  Plants.all((err, plants) => {
    if (err) return next(err)
    response.render('plant', {
      title: 'Past measurements',
      plants: plants
    })
  })
})

app.listen(port, (err) => {
  if (err) return console.error(`An error occurred: ${err}`)
  console.log(`Listening on http://localhost:${port}/`)
})

function blinkingLed (count) {
  let ledBlinks = count * 2
  // The delay between LED blinks.
  let pause = setInterval(() => {
    if (ledBlinks > 0) {
      led.writeSync((led.readSync() + 1) % 2)
      ledBlinks--
    } else {
      // Breaks interval and turn off delay.
      clearInterval(pause)
      led.writeSync(0)
    }
  // Add a 0.1 second delay
  }, 100)
}
