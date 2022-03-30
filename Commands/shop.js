const { MessageEmbed, MessageActionRow } = require("discord.js")
const { prefix } = require("../config.json")
const Command = require("../Structures/Command")
const shop = require("../Assets/game/shop.json")
const primary = require("../Buttons/primary")

module.exports = new Command({
    name: "shop",
    description: "",
    alias: [],
    async run(message, args, client, user) {
        const filter = i => {
            i.deferUpdate()
            return i.user.id == message.author.id
        }
        const result = shop.map((item, i) => `x${item.count.toLocaleString()} ${item.id.getFieldById(item.category).name}** — ${item.price[0].getLogo()} ${item.price[1].toLocaleString()} \n${item.description} \nID: \`${item.id}\`\n`)
        let msg
        start(1)
        async function start(num) {
            let view = result
            const max = 2
            const page = Math.ceil(view.length / max)
            let current = num
            const row = new MessageActionRow().addComponents(primary("<", "previous", current <= 1), primary(">", "next", current >= page))
            
            view = view.slice((max * (current - 1)), max * current)

            const embed = new MessageEmbed()
            .setAuthor({ name: `Page ${current}/${page}` })
            .setTitle("Breaworlds shop")
            .setDescription(`Your wallet: \n${"gems".getLogo()} ${user.gems.toLocaleString()} \n${"wl".getLogo()} ${user.wl.toLocaleString()} \n${"tl".getLogo()} ${user.tl.toLocaleString()}`)
            .addField("Items", `${view.map((v, i) => `**${i + 1}. ${v}`).join("\n")}`)
            .setThumbnail(client.user.displayAvatarURL())
            .setColor("BLUE")
            .setFooter({ text: `${prefix}buy (item id) (amount) to buy`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp()
            if(!msg) msg = await message.channel.send({ embeds: [embed], components: [row] })
            else try {
                msg.edit({ embeds: [embed], components: [row] }) 
            } catch(e) {}

            // Collectors
            const ButtonInteraction = await msg.awaitMessageComponent({
                filter,
                max: 1,
                time: 20000
            }).catch((e) => {
                try {
                    msg.edit({ embeds: [embed], components: [] })
                } catch(e) {}
            })
            if(!ButtonInteraction) return
            const id = ButtonInteraction.customId
            if(id == "previous") start(--current)
            if(id == "next") start(++current)
            
        }
    }
})