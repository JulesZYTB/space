const Event = require('@bot/base/Event.js');
const mongoose = require("mongoose");
const colors = require('colors');
const App = require('@structures/app.js');

module.exports = class extends Event {
  constructor (client) {
    super(client, {
      name: 'ready',
      enabled: true,
    });
  }

  async run (client) {
    await setTimeout(() => {}, 1000)


    client.appInfo = await client.fetchApplication();
    setInterval(async () => {
      client.appInfo = await client.fetchApplication();
    }, 60000);

    await mongoose.connect(process.env.MONGO_DB_URL, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(` `);
    console.log(` `);
    console.log(colors.grey(`---------------------------------------------------`));
    console.log(colors.yellow(`VoidServers was Created by `) + colors.underline.green(`DanPlayz`) + colors.yellow(` and `) + colors.underline.green(`AshMW`));
    console.log(colors.yellow(`Connected to the `) + colors.underline.green(`VoidServers`) +colors.yellow(` database`)); // "on colors.underline.green(MONGO_DB_URL)"
    console.log(colors.yellow(`Successfully logged into `) + colors.underline.green(client.user.tag));


    await new App(client).listen(process.env.PORT || 8080);
    console.log(colors.yellow(`Running on port `) + colors.underline.green(process.env.PORT || 8080));

    console.log(colors.grey(`---------------------------------------------------`));
    console.log(` `);
    console.log(` `);

    function setActivity() {
      //client.user.setActivity(, {type: "WATCHING", status: "dnd"});
	    client.user.setPresence({ status: 'dnd', activity: { name: `sur ${client.guilds.cache.size} serveurs | rc!help | fair Connaître sont serveur`, type: 'PLAYING'}})
      // client.user.setPresence({ status: 'dnd', activity: { name: `my developers build me! (Coming soon)`, type: 'WATCHING'}})
    };

    setActivity();
    setInterval(setActivity, 120000);

try {

    let aaa = await client.database.reboot.get();
    if(client.channels.cache.get(process.env.BOT_LOGS)){
      if (aaa.rebooted == "true") {
        client.channels.cache.get(process.env.BOT_LOGS).send(`**Le bot a été redémarré par** \`User: ${aaa.ranuser}\`**!**`);
      } else {
        client.channels.cache.get(process.env.BOT_LOGS).send(`**Le bot a été redémarré par** \`Unknown\`**!**`);
      }
    }

    if(aaa.rebooted === "true") {
      await client.channels.cache.get(aaa.channelid).messages.fetch(aaa.messageid).then(message => {
        const { MessageEmbed } = require('discord.js');
        const em = new MessageEmbed()
          .setColor('GREEN')
          .setTitle("System Rebooted")
          .setFooter("Redémarrage réussi de tous les systèmes Space Bots!!")
          .setDescription("Chéri je suis rentré!");
        message.edit(em);
      });

      await client.database.reboot.update({ rebooted: false, ranuser: null });
    }
}catch(err){}
  }
};
