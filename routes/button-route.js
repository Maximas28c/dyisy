const express = require('express')
const controller = require('../controllers/button-controller')
const router = express.Router()



router.post('/', controller.create)
module.exports = router