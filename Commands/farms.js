const { MessageEmbed, MessageActionRow } = require("discord.js")
const Command = require("../Structures/Command")
const primary = require("../Buttons/primary")
const ms = require("pretty-ms")
const { prefix } = require("../config")

module.exports = new Command({
    name: "farms",
    description: "",
    alias: ["farm"],
    async run(message, args, client, user) {
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member;
        if(mentioned.user.id != message.author.id) user = await User.findOne({ id: mentioned.user.id })
        if(!user) return message.reply("This user don't have an account yet, ask them to join you!")
        while(user.plant.length < user.maxplant) {
            user.plant.push(null)
        }
        console.log(user.plant)
        const filter = i => {
            i.deferUpdate()
            return i.user.id == message.author.id
        }
        let msg
        start(1)
        async function start(num) {
            const max = 5
            let current = num
            const view = user.plant.slice((max * (current - 1)), max * current)
            const page = Math.ceil(user.plant.length / max)
            const row = new MessageActionRow().addComponents(primary("<", "previous", current <= 1), primary(">", "next", current >= page))
            
            const embed = new MessageEmbed()
            .setTitle(`Showing farm: ${current}/${page}`)
            .setColor("BLUE")
            .setFooter({ text: `${mentioned.user.tag}'s Farm | ${prefix}harvest (platform number) to harvest`, iconURL: mentioned.user.displayAvatarURL() })
            for(let i = 0; i < max; i++) {
                const plant = view[i]
                const timestamp = plant?.time - Date.now()
                embed.addField(`Platform ${(i + 1) + (max * (num - 1))}`, `${!plant ? "Empty" : `x${plant.count} ${plant.logo} ${plant.name} — ${timestamp < 0 ? "**Ready**" : ms(timestamp, { secondsDecimalDigits: 0 })}`}`)
            }
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
                } catch (error) {}
            })
            if(!ButtonInteraction) return
            const id = ButtonInteraction.customId
            if(id == "previous") start(--current)
            if(id == "next") start(++current)
        }
        
    }
})