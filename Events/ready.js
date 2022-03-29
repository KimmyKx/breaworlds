const Event = require("../Structures/Event")

module.exports = new Event("ready", async (client) => {
  console.log("Bot is online!")
  client.user.setActivity(";help", { type: "LISTENING" })
  
})