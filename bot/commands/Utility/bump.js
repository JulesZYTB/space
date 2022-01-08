const Command = require('@bot/base/Command');
const Servers = require('@models/servers')

class BumpCMD extends Command {
    constructor (client) {
      super(client, {
        name: "bump",
        description: "Bump the server higher on the list.",
        category: "Utility",
        usage: "",
        aliases: ["bumpserver", "serverbump"],
        permLevel: "User"
      });
    }

    async run (client, message, args, MessageEmbed) {
        const embed = new MessageEmbed()
          .setColor('PURPLE')
          .setFooter(message.author.username, message.author.avatarURL())
            .setTitle(`Space Serveurs » Bump`)
        
        let server = await Servers.findOne({guildid: message.guild.id}, { _id: false })
        if(!server) { 
            embed.setDescription("Une erreur s'est produite, veuillez contacter un administrateur du site.")
            return message.channel.send(embed);
        }
        
        const timeremain = getTimeRemaining(server.lastbumped)
		      if(timeremain.days == 0) 
            if(timeremain.hours < 2) {
                embed.setDescription(`Trop tôt! S'il te plait reviens dans \n${1-timeremain.hours} heures, ${59-timeremain.minutes} minutes, ${60-timeremain.seconds} secondes.`)
                return message.channel.send(embed)
            }
        await Servers.updateOne({ guildid: server.guildid }, {$set: { lastbumped: new Date(Date.parse(new Date())) } })
        embed.setImage('https://media.discordapp.net/attachments/853230805785772085/929125047271039017/20220107_223027.gif')
        embed.setDescription(`✅ Bumper avec succès!\n \n\ Votre serveur a bien était Bump avec succès, vous pouvez [Voir la page](${process.env.DOMAIN}/server/${message.guild.id})`)
        message.channel.send(embed);
    }
}

function getTimeRemaining(endtime) {
  const total = Date.parse(new Date()) - Date.parse(endtime);
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
}

module.exports = BumpCMD;
