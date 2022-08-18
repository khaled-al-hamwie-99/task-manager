const express = require('express');
require('./db/mongoose.js')
const RouterUser = require('./router/user')
const RouterTask = require('./router/task.js')

const app = express();
const port = process.env.PORT

app.use(express.json())
app.use(RouterUser)
app.use(RouterTask)

app.listen(port, () => {
    console.log("listening on port " + port)
})
