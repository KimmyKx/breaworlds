/** @format */

const Discord = require("discord.js");
const Client = require("./Client.js");
const User = require("../Models/user")

/**
*
* @param {Discord.Message | Discord.Interaction} message
* @param {string[]} args
* @param {Client} client
* @param {User} user
*/

function RunFunction(message, args, client, user) {}

class Command {
  /**
   * @typedef {{name: String, description: String, alias: Array, group: String, run: RunFunction}} CommandOptions
   * @param {CommandOptions} options
   */ 
  constructor(options){
    this.name = options.name;
    this.description = options.description;
    this.alias = options.alias
    this.group = options.group
    this.run = options.run;
  }
}

module.exports = Command;