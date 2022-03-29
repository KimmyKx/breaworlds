const Command = require("../Structures/Command")
const shop = require("../Assets/game/shop")
const { prefix } = require("../config")
const User = require("../Models/user")

module.exports = new Command({
    name: "buy",
    description: "",
    alias: [],
    async run(message, args, client, user) {
        // validate
        if(!args[1]) return message.reply(`Specify an item id, \`${prefix}buy (item id) (amount)\``)
        const item = shop.find(s => s.id == args[1].toLowerCase())
        if(!item) return
        let amount = parseInt(args[2])
        if(!amount) amount = 1
        const [currency, price] = item.price
        if(user[currency] < price * amount) return message.reply(`You need ${currency.getLogo()} ${(price * amount - user[currency]).toLocaleString()} more to purchase this.`)

        message.channel.send({ content: `Successfully bought x${item.count * amount} ${item.id.getFieldById(item.category).name} for ${currency.getLogo()} ${(price * amount).toLocaleString()}` })

        // handling
        const index = user[item.category].findIndex(it => it.id == item.id)
        if(index < 0) user[item.category].push({ id: item.id, count: item.count })
        else user[item.category][index].count += item.count
        user[currency] -= (price * amount)
        await User.updateOne({ id: message.author.id }, user)
    }
})