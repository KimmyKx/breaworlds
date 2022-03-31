require("dotenv").config()
const mongoose = require("mongoose")
const User = require("../Models/user")
mongoose.connect(process.env.mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, err => {
  if(err) console.log(err)
  console.log("Connected to Database")
});

(async function() {
  const u = await User.find({})
  const s = u.sort((a, b) => b.networth - a.networth)
  console.log(s)
})

// User.updateOne({ id: "529734781970284544" }, { $set: { }})
// .then(res => {
//   console.log(res)
// })