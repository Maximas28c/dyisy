const express = require('express')
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

const buttonRoute = require('./routes/button-route')
app.use('/api/button/click', buttonRoute)

module.exports = app