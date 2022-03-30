const items = require("../Assets/game/items.json")
const logo = {
    gems: "<:Gems:890924850057740298>",
    wl: "<:WorldLock:890923132670595083>",
    tl: "<:TitaniumLock:890926619424878592>",
    level: "<:level:943632616450588712>",
    exp: "📈"
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
    this.plant = this.plant.map(p => {
        if(!p) return p
        const info = items.seed.find(s => s.id == p.id)
        if(!info) return p
        p = { ...p, ...info }
        return p
    })
    this.power = (10 + (1 * (this.level - 1))) // 10 is a default value
    const pickaxe = this.equipment.find(e => e.id == "pickaxe") 
    if(pickaxe) {
        this.power += (5 + (pickaxe.level - 1))
    }
    return this
}

/**
 * 
 * @param {String} category category
 * @returns {Object}
 */
String.prototype.getFieldById = function(category) {
    return items[category].find(i => i.id == this)
}

String.prototype.getLogo = function() {
    return logo[this] || ""
}

Object.prototype.networth = function() {
    return Math.floor(this.gems / 2 + (this.wl * 1300) + (this.tl * 140000))
}