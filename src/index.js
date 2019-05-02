const express = require('express')
const errorHandler = require('./middleware/error')
const dbSetUp = require('./db/mongoose') // the files loads
const routers = require('./routers')

const app = express()
const port = 4000 // add env var
dbSetUp.connectToDb('mongodb://test:test123@ds137404.mlab.com:37404/piky') // add to env (dotenv)

app.use(express.json())
app.use(routers)
app.use(errorHandler);

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
