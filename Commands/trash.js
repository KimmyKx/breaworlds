const Command = require("../Structures/Command")
const { prefix, session } = require("../config.json")
const User = require("../Models/user")

module.exports = new Command({
    name: "trash",
    description: "",
    alias: ["recycle"],
    group: "Economy",
    async run(message, args, client, user) {
        if(session.includes(message.author.id)) return message.channel.send("You are currently busy!")
        if(!args[3]) return message.reply(`Please specify an item to recycle, \`${prefix}trash (seed/farmable/consumable) (item id) (amount)\``)
        const category = args[1].toLowerCase()
        const id = args[2].toLowerCase()
        let amount = parseInt(args[3])
        if(amount < 0) return message.reply("You can't recycle negative amount of items")
        if(!["seed", "farmable", "consumable"].includes(category)) return message.reply("Please specify a valid category")
        const itemIndex = user[category]?.findIndex(i => i.id == id)
        if(itemIndex < 0) return message.reply(`Couldn't find that item`)
        const item = user[category][itemIndex]
        if(item.count <= amount) {
            amount = item.count
            user[category].splice(itemIndex, 1)
        } else {
            item.count -= amount
        }
        const gems = (100 * amount)
        user.gems += gems
        message.channel.send(`Recycled x${amount} ${item.name} | Earned ${"gems".getLogo()} ${gems.toLocaleString()}`)
        await User.updateOne({ id: message.author.id }, user)
    }
})