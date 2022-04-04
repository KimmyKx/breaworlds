const { MessageEmbed } = require("discord.js")
const ms = require("pretty-ms")
const User = require("../Models/user")
const Command = require("../Structures/Command")

module.exports = new Command({
    name: "daily",
    description: "",
    alias: ["reward"],
    async run(message, args, client, user) {
        if(user.daily - Date.now() > 0) return message.reply(`You can't claim this yet wait ${ms(user.daily - Date.now(), { secondsDecimalDigits: 0 })}`)
        const gems = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000
        const wl = Math.floor(Math.random() * (2 - 0 + 1)) + 0
        const embed = new MessageEmbed()
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
        .setDescription(`**You get:** \n${"gems".getLogo()} ${gems} \n${"wl".getLogo()} ${wl}`)
        .setColor("BLUE")
        .setTimestamp()
        message.reply({ embeds: [embed] })
        user.gems += gems
        user.wl += wl
        user.daily += Date.now() + 28800000
        await User.updateOne({ id: message.author.id }, user)
    }
})