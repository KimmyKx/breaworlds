/** @format */

const Discord = require("discord.js");
const Client = require("./Client.js");

/**
*
* @param {Discord.Message | Discord.Interaction} message
* @param {string[]} args
* @param {Client} client
* @param {Object} user
*/

function RunFunction(message, args, client, user) {}

class Command {
  /**
   * @typedef {{name: String, description: String, alias: Array, run: RunFunction,}} CommandOptions
   * @param {CommandOptions} options
   */ 
  constructor(options){
    this.name = options.name;
    this.description = options.description;
    this.alias = options.alias
    this.run = options.run;
  }
}

module.exports = Command;