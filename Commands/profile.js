const Command = require("../Structures/Command")
const { createCanvas, loadImage, registerFont} = require("canvas")
const { MessageAttachment } = require("discord.js")
const canvas = createCanvas(750, 250)
const ctx = canvas.getContext("2d")
const User = require("../Models/user")
let background
let wli
let tli 
let gemsi
registerFont("Assets/fonts/Century.ttf", { family: "Century"});
(async function() {
    wli = await loadImage("Assets/image/Wl.png")
    tli =  await loadImage("Assets/image/Tl.png")
    gemsi = await loadImage("Assets/image/Gems.png")
    background = await loadImage("Assets/image/background.jpg")
    console.log("Profile loaded")
})()


module.exports = new Command({
    name: "profile",
    description: "",
    alias: ["p"],
    async run(message, args, client, userM) {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member;
        if(user.user.id != message.author.id) userM = await User.findOne({ id: user.user.id })
        if(!userM) return message.reply("This user don't have an account yet, ask them to join you!")
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
        
        function drawDot(){
            this.color = "rgba(0, 0, 0, 0.5)"
            this.x = 20
            this.y = 20
            this.size = 10
            ctx.fillStyle = this.color
            ctx.beginPath()
            ctx.fillRect(this.x, this.y, canvas.width - (this.x * 2), canvas.height - (this.y * 2))
            ctx.fill()
        }
        drawDot()
        
        const avatar = await loadImage(user.user.displayAvatarURL({format: "jpg"}))
        ctx.drawImage(avatar, 40, canvas.height / 2 - 90, 175, 175)
        ctx.beginPath()
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 2
        ctx.strokeRect(40, canvas.height / 2 - 90, 175, 175)
        ctx.stroke()
        ctx.closePath()
        
        function drawName(text, x, y, size){
            this.fontSize = size
            this.x = x
            this.y = y
            this.text = `${text}`
            ctx.font = `${this.fontSize}px Century`
            ctx.fillStyle = "#ffffff"
            ctx.beginPath()
            ctx.fillText(`${this.text}`, this.x, this.y)
            ctx.fill()
        }
        drawName(`${user.user.tag}`, 250, canvas.height / 3 - 20, 30)
        drawName(`${"No title"}`, 250, canvas.height / 3 + 5, 20)
        drawName(`Level: ${userM.level}`, 250, canvas.height / 3 + 25, 20)
        drawName(`Exp: ${userM.exp.toLocaleString()}/${userM.maxexp.toLocaleString()}`, 250, canvas.height / 3 + 45, 20)
        drawName(`${userM.wl}`, 300, 185, 30) // wl
        drawName(`${userM.tl}`, 410, 185, 30) // tl
        drawName(`${userM.gems.toLocaleString()}`, 530, 185, 30) // gems
        drawName(`Net Worth: ${userM.networth().toLocaleString()}`, 250, 220, 15)
        drawName(`Break Power: ${userM.power.toLocaleString()}`, 550, 220, 15)
        
        // line
        ctx.beginPath()
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 2
        ctx.moveTo(250, 140)
        ctx.lineTo(700, 140)
        ctx.stroke()
        ctx.closePath()

        
        ctx.drawImage(wli, 250, 150, 50, 50)
        ctx.drawImage(tli, 360, 150, 50, 50)
        ctx.drawImage(gemsi, 470, 145, 55, 55)
        
        const attachment = new MessageAttachment(canvas.toBuffer(), "Profile.png")
        message.channel.send({ files: [attachment] })
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
})