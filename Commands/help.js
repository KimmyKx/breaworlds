const { MessageButton, MessageActionRow, MessageEmbed } = require("discord.js")
const Command = require("../Structures/Command")
const config = require("../config")

module.exports = new Command({
    name: "help",
    description: "",
    alias: ["guide"],
    group: "Views",
    run(message, args, client) {
		const categories = []
		
        client.commands.forEach(command => {
        if(categories.includes(command.group) || command.group == "Admin") return
            categories.push(command.group)
        })

        const row = new MessageActionRow()
        .addComponents(new MessageButton().setStyle("LINK").setLabel("Breaworlds server").setURL("https://discord.gg/TttQVHcbGw"))
        const embed = new MessageEmbed()
        .setTitle("Command lists")
        .setColor("GREEN")
        .setDescription(`Prefix: \`${config.prefix}\``)
        .setFooter({ text: "Thank you playing" })
        .setTimestamp()
            categories.forEach(category => {
            embed.addField(category, `\`${Array.from(client.commands).filter(c => c[1].group == category).map(c => c[0]).join("`, `")}\``)
            })
        message.channel.send({ embeds: [embed], components: [row] })
    }
})