const mongoose = require('mongoose')

const connectionURL = process.env.MONGODB_URL


mongoose.connect(connectionURL, { useNewUrlParser: true })

// C:/D/program/weeb/Node/projects/mongodb/bin/mongod.exe --dbpath=C:/D/program/weeb/Node/projects/mongodb-data

