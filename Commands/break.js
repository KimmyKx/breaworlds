const Command = require("../Structures/Command")
const { prefix } = require("../config")
const { MessageEmbed, MessageActionRow } = require("discord.js")
const danger = require("../Buttons/danger")
const success = require("../Buttons/success")
const User = require("../Models/user")
const items = require("../Assets/game/items")
const config = require("../config")
const { levelUp } = require("../Utils/functions")

module.exports = new Command({
    name: "break",
    description: "",
    alias: [],
    async run(message, args, client, user) {
        if(!args[1]) return message.reply(`Specify a farmable id, \`${prefix}break (id)\``)
        const itemIndex = user.farmable.findIndex(f => f.id == args[1].toLowerCase())
        if(itemIndex < 0) return message.reply("You don't have this item silly.")
        if(config.session.includes(message.author.id)) return
        const _item = user.farmable[itemIndex]

        const filter = i => {
            i.deferUpdate()
            return i.user.id == message.author.id 
        }
        let msg
        const row = new MessageActionRow().addComponents(danger("Break", "break"), success("Done", "done"))
        let hit = 0
        let seed = 0
        let block = 0
        let gems = 0
        let exp = 0
        const item = { ..._item, ..._item.id.getFieldById("farmable") }
        const seedIndex = user.seed.findIndex(seed => seed.id == item.id)
        config.session.push(message.author.id)
        await start()
        async function start() {
            const counts = user.farmable[itemIndex].count
            const embed = new MessageEmbed()
            .setTitle(`${message.author.tag} is Breaking...`)
            .setDescription(`${item.logo} ${item.name} (${counts > 0 ? counts : 0}) left \nBreak power: ${user.power} \nHit: ${hit} Times`)
            .setFooter({ text: `Thanks for playing Breaworlds`, iconURL: client.user.displayAvatarURL() })
            .setColor("BLUE")
            if(counts <= 0) return done()
            if(!msg) msg = await message.channel.send({ embeds: [embed], components: [row] })
            else try {
                msg.edit({ embeds: [embed], components: [row] })
            } catch(e) {}
            const ButtonInteraction = await msg.awaitMessageComponent({
                filter,
                max: 1,
                time: 30000
            }).catch(e => {
                done()
            })
            if(!ButtonInteraction) return
            const id = ButtonInteraction.customId
            if(id == "break") {
                hit++
                if(user.seed[seedIndex]?.count >= 500) {
                    embed.setDescription(`Your inventory is full.`)
                    return done()
                }
                const isDone = drop(counts)
                if(isDone) return
                const res = user.farmable[itemIndex].count -= user.power
                if(res <= 0) {
                    user.farmable[itemIndex].count = 0
                }
                await start()
            }

            if(id == "done") {
                done()
                return
            }

            function drop(counts) {
                const blocks = counts - user.power < 0 ? counts : user.power
                for(let i = 0; i < blocks; i++) {
                    const g = Math.floor(Math.random() * (item.drop.gems[1] - item.drop.gems[0] + 1)) + item.drop.gems[0]
                    const e = Math.floor(Math.random() * (item.drop.exp[1] - item.drop.exp[0] + 1)) + item.drop.exp[0]
                    const s = Math.floor(Math.random() * 3) > 0 ? 0 : 1
                    if(seed + s + user.seed[seedIndex]?.count > 500) {
                        embed.setDescription(`Your inventory is full.`)
                        return done()
                    }
                    gems += g
                    exp += e
                    user.gems += g
                    user.exp += e
                    seed += s // 1/3 chance
                    block += Math.floor(Math.random() * 3) > 0 ? 0 : 1 // 1/3 chance
                }
            }

            function done() {
                config.session.splice(config.session.indexOf(message.author.id), 1)
                try {
                    if(hit == 0) 
                        embed.setDescription("You didn't break anything in time..")
                    else
                        embed.addField("Result", `\n${"gems".getLogo()} ${gems.toLocaleString()} \n${"exp".getLogo()} ${exp.toLocaleString()} \n${items.seed.find(it => it.id == item.id).logo} ${seed} \n${item.logo} ${block}\n`)
                    msg.edit({ content: `${message.author.username} was tired this session is done.`, embeds: [embed], components: [] })
                } catch(err) {console.log(err)}
                if(hit == 0) return
                if(user.exp >= user.maxexp) levelUp(user, message)
                save()
                return true
            }

            async function save() {
                
                const blockIndex = user.farmable.findIndex(farmable => farmable.id == item.id)
                if(seedIndex > -1) {
                    user.seed[seedIndex].count += seed
                }
                else if(seed > 0) {
                    user.seed.push({ id: item.id, count: seed })
                }

                if(blockIndex > -1) {
                    const blocks = user.farmable[blockIndex].count += block
                    if(blocks <= 0) user.farmable.splice(blockIndex, 1)
                }
                else if(block > 0) {
                    user.farmable.push({ id: item.id, count: block })
                }
                await User.updateOne({ id: message.author.id }, user)
            }
        }
        
    }
})