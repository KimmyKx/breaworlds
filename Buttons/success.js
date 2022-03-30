const { MessageButton } = require("discord.js")

module.exports = (label, id, disable = false) => {
    return new MessageButton().setStyle("SUCCESS").setLabel(label).setCustomId(id).setDisabled(disable)
}