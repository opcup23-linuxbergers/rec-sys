const Router = require('express')
const router = new Router()
const InterestsController = require('../controller/interests.controller')
const authenticateToken = require("../middlewares/authenticateToken");

router.get('/interests', authenticateToken, InterestsController.getInterests)

module.exports = router