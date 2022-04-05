const Command = require('../Structures/Command');
const config = require('../config');
const ms = require('pretty-ms');
const { MessageEmbed } = require('discord.js');
const { levelUp } = require('../Utils/functions');
const items = require('../Assets/game/items');
const User = require('../Models/user');

module.exports = new Command({
	name: 'harvest',
	description: '',
	alias: [],
	group: 'Game',
	async run(message, args, client, user) {
		if(config.session.includes(message.author.id)) return message.reply('You are currently busy');
		if(!args[1]) return message.reply(`Specify plaform number, \`${config.prefix}harvest (platform number)\``);
		const number = parseInt(args[1]) - 1;
		if(isNaN(number) || number < 0) return message.reply('Invalid platform number');
		while(user.plant.length < user.maxplant) {
			user.plant.push(null);
		}
		if(!user.plant[number]) return message.reply('This platform is empty');
		const timestamp = user.plant[number].time - Date.now();
		if(timestamp > 0) return message.reply('This platform is not ready to be harvested yet, wait ' + ms(timestamp, { secondsDecimalDigits: 0 }));
		config.session.push(message.author.id);
		let desc = '';
		let block = 0;
		let gems = 0;
		let exp = 0;
		let i = 0;
		let isFull = false;
		const farmable = user.farmable.find(f => f.id == user.plant[number].id);
		const embed = new MessageEmbed()
			.setColor('GREEN')
			.setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() })
			.setTimestamp();
		for(i = 0; i < user.plant[number].count; i++) {
			const ran = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
			if((farmable?.count || 0) + ran + block > 500) {
				isFull = true;
				desc += `Inventory is full (500) x${user.plant[number].count - i} seeds left`;
				embed.setColor('RED');
				break;
			}
			block += ran;
			gems += Math.floor(Math.random() * (15 - 5 + 1)) + 5;
			exp += Math.floor(Math.random() * (10 - 3 + 1)) + 5;
		}
        
		const blockInfo = items.farmable.find(item => item.id == user.plant[number].id);
		if(!farmable) {
			user.farmable.push({ id: user.plant[number].id, count: block });
		} else {
			farmable.count += block;
		}
		user.gems += gems;
		user.exp += exp;

		if(!isFull) user.plant[number] = null;
		else user.plant[number].count -= i;
		desc += `\n${'gems'.getLogo()} ${gems.toLocaleString()} \n${'exp'.getLogo()} ${exp.toLocaleString()} \n${blockInfo.logo} x${block} ${blockInfo.name}`;
		embed.setDescription(`${desc}`);
		if(user.exp >= user.maxexp) levelUp(user, message);
		message.channel.send({ embeds: [embed] });
		config.session.splice(config.session.indexOf(message.author.id, 1));
		await User.updateOne({ id: message.author.id }, user);
	}
});