require("dotenv").config()
const mongoose = require("mongoose")
mongoose.connect(process.env.mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, err => {
  if(err) console.log(err)
  console.log("Connected to Database")
})
