const express = require('express');
require('./db/mongoose.js')
const RouterUser = require('./router/user')
const RouterTask = require('./router/task.js')

const app = express();

app.use(express.json())
app.use(RouterUser)
app.use(RouterTask)

module.exports = app