const { MessageEmbed } = require("discord.js")

function levelUp(user, message) {
    const { level } = user
    let up = 0
    do {
        user.level++
        up++
        user.exp -= user.maxexp
        user.power += 1
        user.maxexp += (user.level * 1100 + 1000)
    } while(user.exp >= user.maxexp)
    const em = new MessageEmbed()
    .setColor("GREEN")
    .setDescription(`**Level up!** ${level} > ${user.level} \nBreak power + ${1 * up}`)
    .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() })
    message.channel.send({ embeds: [em] })
}

module.exports = {
    levelUp
}