const Command = require("../Structures/Command")
const { prefix } = require("../config")
const User = require("../Models/user")

module.exports = new Command({
    name: "plant", 
    description: "",
    alias: [],
    group: "Game",
    async run(message, args, client, user) {
        if(!args[1] || !args[2]) return message.reply(`Specify an item id and count, \`${prefix}plant (seed id) (count)\``)
        if(user.plant.length >= user.maxplant && user.plant.every(p => p)) return message.reply(`Your farm is currently full check them on \`${prefix}farms\``)
        while(user.plant.length < user.maxplant) {
            user.plant.push(null)
        }
        let available = user.plant.findIndex(p => !p)
        const id = args[1].toLowerCase()
        let count = parseInt(args[2])
        const seedIndex = user.seed.findIndex(s => s.id == id)
        const seed = user.seed.find(s => s.id == id)
        if(!seed) return message.reply("You don't have this item.")
        if(count > seed.count) count = seed.count
        if(count <= 0 || !count) return message.reply("Invalid count")
        message.reply(`Planted x${count} ${seed.logo} ${seed.name} on Platform ${available + 1}, view them on \`${prefix}farms\``)
        if(count >= seed.count) user.seed.splice(seedIndex, 1)
        else user.seed[seedIndex].count -= count
        user.plant[available] = { id: seed.id, count, time: Date.now() + seed.growth }
        await User.updateOne({ id: message.author.id }, user)
    }
})