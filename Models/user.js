const mongoose = require("mongoose")
const { Schema } = mongoose

const schema = new Schema({
    id: String,
    farmable: [{
        id: String,
        count: Number
    }], 
    seed: [{
        id: String,
        count: Number
    }],
    consumable: [],
    equipment: [{
        id: String,
        count: Number,
        level: Number
    }],
    plant: [{
        id: String,
        count: Number,
        time: Number
    }],
    maxplant: {
        type: Number,
        default: 5
    },
    level: {
        type: Number,
        default: 1
    }, 
    exp: {
        type: Number,
        default: 0
    },
    maxexp: {
        type: Number,
        default: 10000
    },
    gems: {
        type: Number,
        default: 10000
    },
    wl: {
        type: Number,
        default: 0
    },
    tl: {
        type: Number,
        default: 0
    },
    fish: {
        type: Number,
        default: 0
    },
    networth: {
        type: Number,
        get: net
    },
    daily: {
        type: Number,
        default: 0
    }
})

function net() {
    return Math.floor(this.gems / 2 + (this.wl * 1300) + (this.tl * 140000))
}

schema.set('toObject', { getters: true });
schema.set('toJSON', { getters: true });

const User = mongoose.model("User", schema)

module.exports = User