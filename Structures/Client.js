/** @format */
require("dotenv").config()
const Discord = require("discord.js")
const config = require("../config.json")
const Command = require("./Command")
const express = require("express")
const app = express()
const fs = require("fs")

class Client extends Discord.Client {
  constructor(options){
    super({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, "GUILD_MEMBERS"] })

    /** 
     * @type {Discord.Collection<string, Command>}
     */
    this.commands = new Discord.Collection()
    this.buttons = new Discord.Collection()
  }
  start() {
    this.#express()
    fs.readdirSync("./Commands").filter(file => file.endsWith(".js")).forEach(file => {
        /**
         * @type {Command}
         */
        const command = require(`../Commands/${file}`)
        console.log(`Command ${command.name} loaded`)
        this.commands.set(command.name, command)
        this.prefix = config.prefix
    })
    fs.readdirSync("./Events").filter(file => file.endsWith(".js")).forEach(file => {
        const event = require(`../Events/${file}`)
        console.log(`Event ${event.event} loaded`)
        this.on(event.event, event.listen.bind(null, this))
    })

    this.login(process.env.token)
  }

  #express() {
    app.get("/", (req, res) => {
    	res.send("Maru Bot.")
    })
    
    app.listen(process.env.PORT || 5500, () => {
    	console.log("Workspace is Running")
    })
  }
}

module.exports = Client