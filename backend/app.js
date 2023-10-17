const express = require('express')
const userRouter = require('./routes/user.routes')
const authRouter = require('./routes/auth.routes')
const interestsRouter = require('./routes/interests.routes')
const flightRouter = require('./routes/flight.routes')
const PORT = process.env.PORT || 8080
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
app.use('/', userRouter)
app.use('/', authRouter)
app.use('/', interestsRouter)
app.use('/', flightRouter)

//app.get('/', (req, res) => {
//    res.send('sasd')
//})


app.listen(PORT, () => console.log('Server has been started on port ' + PORT))
