const Command = require("../Structures/Command")
const { admins, prefix } = require("../config")
const User = require("../Models/user")

module.exports = new Command({
    name: "add",
    description: "",
    alias: [],
    group: "Admin",
    async run(message, args, client, user) {
        if(!admins.includes(message.author.id)) return
        if(!args[1]) return message.channel.send(`Please provide an amount to add \`${prefix}add (amount) (user)\``)
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[1])
        if(!member) return message.channel.send("Please mention a valid member of this server")
        const amount = parseInt(args[1])
        if(isNaN(amount)) return message.channel.send("Please provide a valid number")
        const m = await User.findOne({ id: member.id }).lean()
        if(!m) return message.reply("This user has not been registered yet")
        m.gems += amount
        await User.updateOne({ id: member.id }, m)
        message.reply("Successfully added "+ "gems".getLogo() + amount.toLocaleString() + " gems to " + member.user.tag)
    }
})