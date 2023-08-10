require('dotenv').config();
const { Client, IntentsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const fs = require("fs");
const {ping} = require("minecraft-protocol")
const mongoose = require("mongoose")

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
})

const server = {
    host: process.env.Minecraft_id,
    port: process.env.Minecraft_port,     
    noPongTimeout: 1000,
    closeTimeout: 1000    
  };

client.on("ready", (c) =>{
    console.log(`${c.user.tag} is now online!`)
});

client.on("messageCreate", (message) => {
    if (message.author.bot) {
        return;
    }
    console.log(message.content)
});

client.on("interactionCreate",async (interaction) => {
    if (interaction.channelId === process.env.Channel_id) {

    if (interaction.customId === "att") {
        interaction.user.send("Funkar det?")
        interaction.reply(
            {
                content: "Server Ownder att:ed",
                ephemeral: true
            }
        )
    }
    if (interaction.commandName === "initserver") {
        const Serversettings = {
            server_id:interaction.commandGuildId,
            
        }
    }
    if (interaction.commandName === "ping"){
        checkOnlinePlayers((err, response) => {
            if (err) {
                interaction.reply({
                    content:"The server is not online eight now \n Press the button to @ server owner",
                    components: [attButton,]

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
    }

    if (interaction.commandName === "bellman"){
        const Svar = interaction.options.get("add")
        if (Svar) {
            console.log(Svar, "Lades till")
            var SvarValue = Svar.value
        }
        else var SvarValue = null
        jsonWrighter("bellman.json", SvarValue, (err, jsonString) =>{
            if (err) {
                console.error(err)
            }
            if (jsonString){
                interaction.reply(jsonString[Math.floor(Math.random()*jsonString.length)])
            }
            else {
                interaction.reply("Tack för skämtet! \n Det kommer att användas väl...")
            }
        })
    };
}
else {
    interaction.reply({
        ephemeral: true,
        content:"Wrong Channel Mate!"
    })
}
})

function jsonWrighter(filePath, data = null, cb) {
    fs.readFile(filePath, "utf-8", (err, fileData) =>{
        if (err) {
            return cb && cb(err)
        }
        const Data = JSON.parse(fileData);
        if (data){
            Data.push(data)
            fs.writeFile(filePath, JSON.stringify(Data, null, 2), err =>{
                if (err){
                    return cb && cb(err)
                } else {
                    return cb && cb(null, null)
                }
            })
        }else {
            return cb && cb(null, Data)
        }
       
        
    })
}

function checkOnlinePlayers(cb) {
    ping(server, (error, response) => {
      if (error) {
        console.error('Failed to ping server:\n', error);
        return cb && cb(error, null)
      }
      return cb && cb(null, response)
    });
  }


const attButton = new ActionRowBuilder();

attButton.components.push(

new ButtonBuilder()
.setLabel(`<@vancia100>`)
.setCustomId("att")
.setStyle(ButtonStyle.Primary)
);
client.login(process.env.TOKEN);

