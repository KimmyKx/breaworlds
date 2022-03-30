const { MessageEmbed, User } = require("discord.js")
const Command = require("../Structures/Command")

module.exports = new Command({
    name: "inventory", 
    description: "",
    alias: ["inv", "inven"],
    async run(message, args, client, user) {
        const userM =  message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member.user
        if(userM.id != message.author.id) userM = (await User.findOne({ id: userM.id }).lean()).joins()
        const embed = new MessageEmbed()
        .setAuthor({ name: `${userM.nickname || userM.username}'s Inventory`, iconURL: userM.displayAvatarURL() })
        .setColor("BLUE")
        .addField("Farmables", `${user.farmable.map(f => `${f.logo} **${f.name}** (${f.count})\nID: \`${f.id}\``).join("\n")}${!user.farmable[0] ? "No farmables." : ""}`)
        .addField("Seeds", `${user.seed.map(f => `${f.logo} **${f.name}** (${f.count})\nID: \`${f.id}\``).join("\n")}${!user.seed[0] ? "No seeds." : ""}`)
        .setTimestamp()
        message.channel.send({ embeds: [embed] })
    }
})