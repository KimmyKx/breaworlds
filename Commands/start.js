const Command = require("../Structures/Command")
const User = require("../Models/user")

module.exports = new Command({
    name: "start",
    description: "",
    alias: [],
    async run(message, args, client, user) {
        if(user) return
        message.channel.send("Welcome!")
        await new User({ id: message.author.id }).save()
    }
})