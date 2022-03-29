const { MessageButton } = require("discord.js")

module.exports = (label, id, disable = false) => {
    return new MessageButton().setStyle("PRIMARY").setLabel(label).setCustomId(id).setDisabled(disable)
}