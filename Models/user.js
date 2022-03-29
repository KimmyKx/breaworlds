const mongoose = require("mongoose")

const User = mongoose.model("User", {
    id: String,
    farmable: [{
        id: String,
        count: Number
    }], 
    seed: [{
        id: String,
        count: Number
    }],
    consumable: [{
        id: String,
        count: Number
    }],
    level: {
        type: Number,
        default: 0
    }, 
    exp: {
        type: Number,
        default: 0
    },
    maxEXP: {
        type: Number,
        default: 0
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
    }
})

module.exports = User