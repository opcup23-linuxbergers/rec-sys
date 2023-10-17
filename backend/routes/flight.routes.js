const Router = require('express')
const router = new Router()
const flightController = require('../controller/flight.controller')
const authenticateToken = require("../middlewares/authenticateToken");

router.get('/flights', authenticateToken, flightController.getFlights)
router.post('/flight', flightController.setFlight)
router.post('/sit/new', flightController.newSit)
router.get('/flight/:id', authenticateToken, flightController.getFlight)
router.post('/flight/:id', authenticateToken, flightController.reserveSeat)

module.exports = router