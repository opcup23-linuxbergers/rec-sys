const Router = require('express')
const router = new Router()
const authController = require('../controller/auth.controller')

router.get('/auth',authController.auth)

module.exports = router
