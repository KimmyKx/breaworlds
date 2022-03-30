const { MessageEmbed, User, MessageActionRow, MessageSelectMenu } = require("discord.js")
const Command = require("../Structures/Command")

module.exports = new Command({
    name: "inventory", 
    description: "",
    alias: ["inv", "inven"],
    async run(message, args, client, user) {
        const userM =  message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member.user
        if(userM.id != message.author.id) userM = (await User.findOne({ id: userM.id }).lean()).joins()
        const views = {
            Farmables: user.farmable.map(f => `${f.logo} **${f.name}** (${f.count})\nID: \`${f.id}\``).join("\n"),
            Seeds: user.seed.map(f => `${f.logo} **${f.name}** (${f.count})\nID: \`${f.id}\``).join("\n"),
            Consumables: user.consumable.map(f => `${f.logo} **${f.name}** (${f.count})\nID: \`${f.id}\``).join("\n")
        }
        let msg
        const filter = i => {
            i.deferUpdate()
            return i.user.id == message.author.id
        }
        const row = new MessageActionRow()
        .addComponents(new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('Select Category')
            .addOptions([
                {
                    label: "All",
                    description: "Shows every items",
                    value: "all"
                },
                {
                    label: 'Farmable',
                    description: 'Sorts inventory view by farmable',
                    value: 'Farmables'
                },
                {
                    label: 'Seed',
                    description: 'Sorts inventory view by seeds',
                    value: 'Seeds'
                },
                {
                    label: 'Consumable',
                    description: 'Sorts inventory view by seeds',
                    value: 'Consumables'
                }
            ])
        )
        start("all")
        async function start(type) {
            const embed = new MessageEmbed()
            .setAuthor({ name: `${userM.nickname || userM.username}'s Inventory`, iconURL: userM.displayAvatarURL() })
            .setColor("BLUE")
            .setTimestamp()
            Object.keys(views).forEach(key => {
                if(key != type && type != "all") return
                const lowerKey = key.toLowerCase()
                embed.addField(`${key}`, `${views[key]}${!user[lowerKey.substring(0, lowerKey.length - 1)][0] ? `No ${lowerKey}.` : ""}`)
            })
            try {
                !msg ? msg = await message.channel.send({ embeds: [embed], components: [row] }) : msg.edit({ embeds: [embed], components: [row] })
            } catch(e) {}
            const ButtonInteraction = await msg.awaitMessageComponent({
                filter,
                max: 1,
                time: 30000
            }).catch(e => {
                try {
                    msg.edit({ embeds: [embed], components: [] })
                } catch(err) {}
            })
            if(!ButtonInteraction) return
            const [value] = ButtonInteraction.values
            start(value)
        }
    }
})