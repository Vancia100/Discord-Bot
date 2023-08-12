const {ping} = require("minecraft-protocol")
const {ActionRowBuilder, ButtonBuilder, interaction, ButtonStyle, ComponentType, Client,} = require("discord.js")
const db = require("../Schemas/guildSchema")


module.exports = {
    command: {
        name: "ping",
        description: "status på minecraft servern"
    },
    /**
     * 
     * @param {interaction} interaction 
     * @param {Client} guild 
     * @returns 
     */
    code: async (interaction, guild) => {
    
        const serverData = await db.findOne({guild:interaction.guildId})
        //console.log(serverData)
        const serverIp = serverData.minecraftIp
        const serverPort = serverData.minecraftPort
        const serverMod = serverData.minecraftMod

    if (!serverIp || !serverPort || !serverMod){
        console.log("Something in the way...")
        console.log(serverIp, serverPort, serverMod)
        interaction.reply({
            content:"Not all fields are suplied in the database. Ask a Admin to run /init-server to get it going",
            ephemeral:true,
        })
        return
    }
    const server = {
        host: serverIp,
        port: serverPort,     
        noPongTimeout: 1000,
        closeTimeout: 1000    
      };
    checkOnlinePlayers(server, async (err, response) => {
        if (err) {
            const user = await guild.users.fetch(serverMod)
            const attButton = new ActionRowBuilder();
            attButton.components.push(

            new ButtonBuilder()
            .setLabel(`@${user.username}`)
            .setCustomId("att")
            .setStyle(ButtonStyle.Danger)
            );
            const reply = await interaction.reply({
                content:"The server is not online right now \n Press the button to @ server owner",
                components: [attButton,]
            })
            const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 20_000
            })
            let disconected = false
            collector.on("collect", (async interaction => {
                if(interaction.customId === "att") {
                    interaction.update({
                        content:"The server is not online right now. \nThe server owner has been notified",
                        components:[]
                    })
                    user.send("Go fix server \nIt is offline")
                    disconected = true
                    collector.stop();
                }
            }))
            collector.on("end", () => {
            if (!disconected) {
                reply.edit({
            content:"The server is not online right now.",
            components:[],
        })
            }
            })
        }
        else {
            const onlienePlayers = response.players.online
            console.log(onlienePlayers)
            if (onlienePlayers != 0) {
                var stringResponse = `${onlienePlayers} utav ${response.players.max} spelare är online. Det är:`
                playerArray = response.players.sample
                for (let i in playerArray) {
                    stringResponse = stringResponse + "\n" + playerArray[i].name
                }
                interaction.reply(stringResponse)
            }
            else{
                interaction.reply("Det är ingen online just nu")
            }
        }
    })
},
}

function checkOnlinePlayers(server, cb) {
    ping(server, (error, response) => {
      if (error) {
        console.error('Failed to ping server:\n', error);
        return cb && cb(error, null)
      }
      return cb && cb(null, response)
    });
}