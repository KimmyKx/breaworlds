const Command = require("../Structures/Command")
const { prefix } = require("../config")
const User = require("../Models/user")
const ms = require("pretty-ms")
const fishes = [
    {
        name: "Carp",
        rate: [1, 35],
        logo: "<:Carp:891836379636580362>",
        gems: 750
    },
    {
        name: "Trout",
        rate: [36, 55],
        logo: "<:Trout:891836487941902358>",
        gems: 1000
    },
    {
        name: "Catfish",
        rate: [56, 75],
        logo: "<:Catfish:891836549665267733>",
        gems: 1000
    },
    {
        name: "Goldfish",
        rate: [76, 85],
        logo: "<:Goldfish:891836607282438174>",
        gems: 1500
    },
    {
        name: "Salmon",
        rate: [86, 95],
        logo: "<:Salmon:891836663918108693>",
        gems: 1500
    },
    { 
        name: "Shark",
        rate: [96, 100],
        logo: "<:Sharks:891836715197673495>",
        gems: 5000
    }
]

module.exports = new Command({
    name: "fish",
    description: "",
    alias: [],
    group: "Game",
    async run(message, args, client, user) {
        const index = user.equipment.findIndex(eq => eq.id == "rod")
        const rod = user.equipment[index]
        if(index < 0) return message.reply(`You don't have a rod yet check them on \`${prefix}shop\``)
        const timestamp = user.fish - Date.now()
        if(timestamp > 0) return message.reply(`You can't fish again yet, wait ${ms(timestamp, { secondsDecimalDigits: 0 })}`)

        let ran = Math.floor(Math.random() * (101 - 1) + 1);
        const fish = fishes.find(f => ran >= f.rate[0] &&  ran <= f.rate[1])
        if(!fish) {
            message.channel.send("Oops! You just broke your fishing rod")
            user.equipment.splice(index, 1)
            await User.updateOne({ id: message.author.id }, user)
            return
        }
        user.gems += fish.gems
        user.fish = Date.now() + 45000
        message.channel.send(`You just caught a ${fish.logo} ${fish.name} | ${"gems".getLogo()} ${fish.gems.toLocaleString()}`)
        await User.updateOne({ id: message.author.id }, user)
    }
})