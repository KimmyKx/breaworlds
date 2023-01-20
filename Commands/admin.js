const Command = require('../Structures/Command');
const { admins } = require('../config');
const { MessageEmbed } = require('discord.js');

module.exports = new Command({
	name: 'admin',
	description: '',
	alias: [],
	group: 'Admin',
	async run(message, args, client) {
		if(!admins.includes(message.author.id)) return;
		const users = await Promise.all(admins.map(admin => client.users.fetch(admin)));
		const embed = new MessageEmbed()
			.setColor('GREEN')
			.addField('Users', `${users.map(u => `• ${u.username}#${u.discriminator}`).join('\n')}`)
			.addField('Commands', `\`${Array.from(client.commands).filter(c => c[1].group == 'Admin').map(c => c[0]).join('`, `')}\``)
			.setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() });
		message.channel.send({ embeds: [embed] });
	}
});