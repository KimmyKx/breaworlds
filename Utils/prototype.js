const items = require("../Assets/game/items.json")
const logo = {
    gems: "<:Gems:890924850057740298>",
    wl: "<:WorldLock:890923132670595083>",
    tl: "<:TitaniumLock:890926619424878592>"
}
Object.prototype.joins = function() {
    Object.keys(items).forEach(keys => {
        this[keys] = this[keys].map(item => {
            const selected = items[keys].find(f => f?.id == item.id)
            if(!selected) return null
            item = { ...item, ...selected }
            return item
        })
    })
    return this
}

String.prototype.getFieldById = function(category) {
    return items[category].find(i => i.id == this)
}

String.prototype.getLogo = function() {
    return logo[this]
}