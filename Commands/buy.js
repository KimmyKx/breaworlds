const Command = require("../Structures/Command")
const shop = require("../Assets/game/shop")
const { prefix, session } = require("../config")
const User = require("../Models/user")

module.exports = new Command({
    name: "buy",
    description: "",
    alias: [],
    group: "Economy",
    async run(message, args, client, user) {
        // validate
        if(!args[1]) return message.reply(`Specify an item id, \`${prefix}buy (item id) (amount)\``)
        if(session.includes(message.author.id)) return message.reply("You are busy at the moment")
        const item = shop.find(s => s.id == args[1].toLowerCase())
        if(!item) return
        let amount = parseInt(args[2])
        if(!amount || amount <= 0) amount = 1
        const [currency, price] = item.price
        try {
            if(user[currency] < price * amount) return message.reply(`You need ${currency.getLogo()} ${(price * amount - user[currency]).toLocaleString()} more to purchase this.`)

        } catch(e) {}
        const index = user[item.category]?.findIndex(it => it.id == item.id)
        
        // handling
        if(item.category == "farmable") {
            if((item.count * amount) > 500 || (user[item.category][index]?.count || 0) + (item.count * amount) > 500) return message.reply("You don't have enough inventory | max: 500 per item")
            if(index < 0) user[item.category].push({ id: item.id, count: (item.count * amount) })
            else user[item.category][index].count += (item.count * amount)
        }
        else if(item.category == "equipment") {
            if(amount > 1) amount = 1
            const eq = user[item.category].find(e => e.id == item.id)
            if(eq) return message.reply("You already have this item")
            user[item.category].push({ id: item.id, count: amount, level: 1 })
        } else if(item.category == "currency") {
            if(user[item.id] + amount > 500) return message.reply("You can't this more than 500")
            user[item.id] += amount
        }
        message.channel.send({ content: `Successfully bought x${item.count * amount} ${item.id.getFieldById(item.category)?.name || item.name || ""} for ${currency.getLogo()} ${(price * amount).toLocaleString()}` })

        user[currency] -= (price * amount)
        await User.updateOne({ id: message.author.id }, user)
    }
})