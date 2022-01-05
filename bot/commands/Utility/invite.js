const Command = require('@bot/base/Command');
const Servers = require("@models/servers");

class InviteCMD extends Command {
    constructor (client) {
      super(client, {
        name: "invite",
        description: "Modifiez l'Invitation instantanée sur cette chaîne. Si [channel] est spécifié, créez une invitation instantanée pour ce channel (administrateur uniquement)",
        category: "Utility",
        usage: "[channel]",
        aliases: ["invitechannel", "invitechan", "setinvite"],
        permLevel: "User"
      });
    }

    async run (client, message, args, MessageEmbed) {
        if(!message.guild.me.permissions.has(1)) return message.channel.send("j'ai besoin de l'autorisation `CREATE_INVITE` pour cette commande.");
        let selectedchannel = message.mentions.channels.first() || message.channel;

        let invite = await selectedchannel.createInvite({ maxAge: 0, maxUses: 0 }).catch(() => {});
        if(!invite) return message.channel.send(`Je n'ai pas pu créer d'invitation à  ${selectedchannel}`);
        await Servers.updateOne({ guildid: message.guild.id }, {$set: { invite } })

		    const embed = new MessageEmbed()
        	.setColor('PURPLE')
        	.setFooter(message.author.username, message.author.avatarURL())
          .setTitle(`Space Serveurs » Lien d'invitation`)
          .setDescription(`L'Invitation Instantanée a été définie !`)
          .addField('😎 Channel', `${selectedchannel}`)
          .addField('✅ Instant Invite', `${invite}`)
        message.channel.send(embed);
    }
}

module.exports = InviteCMD;
