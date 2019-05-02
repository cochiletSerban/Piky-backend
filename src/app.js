const express = require('express')
const dbSetUp = require('./db/mongoose')
const  cors = require('cors');
const routers = require('./routers')

const app = express()
const port = process.env.PORT || 4000
dbSetUp.connectToDb('mongodb://test:test123@ds137404.mlab.com:37404/piky') // add to env (dotenv)

app.use(cors());
app.use(express.json())
app.use(routers)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
