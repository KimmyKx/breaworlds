const Command = require('../Structures/Command');
const { loadImage, createCanvas, registerFont } = require('canvas');
const User = require('../Models/user');
const { fillTextWithTwemoji } = require('node-canvas-with-twemoji-and-discord-emoji');
const { MessageAttachment } = require('discord.js');
const canvas = createCanvas(600, 550);
registerFont('Assets/fonts/Century.ttf', { family: 'Century'});

let background;
(async function() {
	background = await loadImage('Assets/image/lb.jpg');
})();

module.exports = new Command({
	name: 'leaderboard',
	description: '',
	alias: ['lb'],
	group: 'Views',
	async run(message, args, client) {
		const ctx = canvas.getContext('2d');
        
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
		const u = await User.find({});
		const users = u.sort((a, b) => b.networth - a.networth).slice(0, 10);
    
		function drawDot(){
			this.color = 'rgba(0,0,0,0.5)';
			this.x = 20;
			this.y = 20;
			ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, canvas.width - (this.x * 2), canvas.height - (this.y * 2));
			ctx.fill();
			ctx.closePath();
		}
		drawDot();

		async function drawText(text,x,y,size){
			this.text = text;
			this.x = x;
			this.y = y;
			this.size = size;
			ctx.font = `${this.size}px Century`;
			ctx.fillStyle = '#ffffff';
			ctx.beginPath();
			await fillTextWithTwemoji(ctx, `${this.text}`, this.x, this.y);
			ctx.fill();
			ctx.closePath();
		}
		await drawText('🏅 Leaderboard 🏅', canvas.width / 3 - 30, 50, 30);
		let textY = 60;
		await new Promise(resolve => {
			users.forEach(async (u, i) => {
				const userInfo = await client.users.fetch(`${u.id}`);
				if(!userInfo) return;
				textY += 40;
				let text = `${i + 1}. ${userInfo.username}#${userInfo.discriminator} - ${u.networth.toLocaleString()}`;
				if(i == 0) text += ' 🥇';
				else if(i == 1) text += ' 🥈';
				else if(i == 2) text += ' 🥉';
				await drawText(`${text}`, 40, textY, 25);
				if(i == users.length - 1) resolve(true);
			});
		});
		let userRank = users.findIndex(u => u.id == message.author.id);
		await drawText(userRank < 0 ? 'Your rank: not ranked.' : `Your rank: ${userRank + 1}. ${message.author.tag} - ${users[userRank].networth.toLocaleString()}`, 40, 500, 25);
      
    
		function drawLine(){
			ctx.beginPath();
			ctx.strokeStyle = '#fff';
			ctx.lineWidth = 2;
			ctx.moveTo(40, 60);
			ctx.lineTo(canvas.width - 40, 60);
			ctx.stroke();
			ctx.closePath();
		}
		drawLine();
		const attachment = new MessageAttachment(canvas.toBuffer(), 'Leaderboard.png');
		message.channel.send({ files: [attachment] });
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
});