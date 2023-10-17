const Router = require('express')
const router = new Router()
const userController = require('../controller/user.controller')
const authenticateToken = require("../middlewares/authenticateToken");

router.get('/user', authenticateToken, userController.getUser)
router.put('/user', authenticateToken, userController.editUser)
router.get('/user/match/:id', authenticateToken, userController.match)
router.post('/user/distance', userController.getDistance)
router.post('/user/interests', authenticateToken, userController.addUserInterests)
router.post('/user/bad_habits', authenticateToken, userController.addUserBadHabits)
router.post('/user/new', userController.addNewUser)

module.exports = router