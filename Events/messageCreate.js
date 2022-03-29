const Event = require("../Structures/Event")
const config = require("../config.json")
const User = require("../Models/user")
const ignore = ["start", "help"]

module.exports = new Event("messageCreate", async (client, message) => {

    if(!message.content.startsWith(config.prefix) || config.maintenance) return
    const args = message.content.substring(config.prefix.length).split(/ +/)
    const command = client.commands.find(cmd => cmd.name == args[0].toLowerCase() || cmd.alias.includes(args[0].toLowerCase()))

    if(!command) return

    const user = await User.findOne({ id: message.author.id }).lean()

    if(!user && !ignore.includes(args[0].toLowerCase())){
        const username = message.guild.members.cache.get(message.author.id).nickname || message.author.username
        const embed = new MessageEmbed()
        .setAuthor({ name: `${username}`, iconURL: message.author.displayAvatarURL() })
        .setColor("BLUE")
        .setDescription(`You don't have an account yet type \`${config.prefix}start\` to begin`)
        .setFooter({ text: `Check ${config.prefix}help for guide.` })
        return message.channel.send({ embeds: [embed] })
    }
    command.run(message, args, client, user.joins())
})