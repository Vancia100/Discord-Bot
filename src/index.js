require('dotenv').config();
const { Client, IntentsBitField, REST, Routes, ApplicationCommandOptionType, MessageFlags, PermissionFlagsBits} = require("discord.js");
const fs = require("fs");
const path = require("path")
const mongoose = require("mongoose");
const rest = new REST({ version: "10"}).setToken(process.env.TOKEN);
const guildDB = require("./Schemas/guildSchema");


const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
})

const basicCommands = [{
    name:"init",
    description:"The initial setup required to make the bot work on this server",
    options:[
    {
    name:"channel",
    description: "What channel to use to send commands",
    type:ApplicationCommandOptionType.Channel,
    },],
    },
    {
        name:"test",
        description:"Does absolutely nothing"
    }
]

async function basicCommandsEnabled () {
    const commands = await updateRegistry()
    console.log("Started doing things...", commands)
    for (const command of commands) {
        const newOption = {
            name: `disable-${command.name}`,
            description: `False to disable the command ${command.name}`,
            type: ApplicationCommandOptionType.Boolean,
            default: false,
        };
        basicCommands[0].options.push(newOption)
    }
    //console.log("Things Pushed!", basicCommands)
}

const commandRegistry = new Map();


async function updateRest(guildId, files) {
    console.log("updating Rest!")
    console.log(files)
    await rest.put(
        Routes.applicationGuildCommands(
            process.env.Client_id, 
            guildId,
        ),
        {body: files})
}


async function updateRegistry(guildId = null, enabled = false) {
    console.log("registry uppdating...")
    const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith(".js"))
    let bodies = []
    for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    if (enabled[command.command.name]) continue;
    commandRegistry.set(command.command.name, command)
    bodies.push(command.command)
    }
    if (!guildId) return bodies;
    //console.log(bodies);
    updateRest(guildId, bodies.concat(basicCommands));
}


client.on("ready", (c) =>{
    console.log(`${c.user.tag} is now online!`)
});


client.on("guildCreate", async (guild) => {
    console.log("joined server", guild.name)
    try {
        console.log("Registering slash commads")
                updateRest(guild.id,basicCommands)
        } catch (error) {
        console.log(error)
    }
})


client.on("interactionCreate",async (interaction) => {
    channelIdDb = await guildDB.findOne({guild: interaction.guildId})
    if (channelIdDb && !(channelIdDb.channel == interaction.channelId))
    {
    await interaction.reply({
        content:"Wrong channel mate",
        ephemeral: true
    })
    return;
    }
    const command = commandRegistry.get(interaction.commandName)
    if (command){
        try {
        await command.code(interaction, client);
        } catch (error) {
        console.log(error)
        try {
            await interaction.reply({
                content:`something went wrong with the command ${command}`,
                ephemeral:true
            })
        } catch (error) {
            console.log(error)
        }
        }
    }



if (interaction.commandName === "init") {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        interaction.reply({
            content:"This command is only for admins",
            ephemeral:true
        })
    }
const returnValue = interaction.options.get("channel")
const choises = await updateRegistry()
var enabled = {}
console.log("It has started!")
    for (const choise of choises) {
        enabled[choise.name] = interaction.options.get(`disable-${choise.name}`) ? interaction.options.get(`disable-${choise.name}`).value : false;
    }
    console.log(enabled)
if (returnValue){
    if (channelIdDb) {
        channelIdDb.channel = returnValue.value
        await channelIdDb.save()
        interaction.reply("Channel Updated!")
        return
    }
       const Serversettings = new guildDB({
            guild: interaction.guildId,
            channel: returnValue.value,
        })
        await Serversettings.save()
        await interaction.reply("It worked!")
        return
    }
    await updateRegistry(interaction.guildId, enabled)
    await interaction.reply("Commands Updated!")
}


if (interaction.commandName === "test"){
    await interaction.reply("test worked!")
}
});



(async () => {
    try {
        mongoose.set("strictQuery", false)
        await mongoose.connect(process.env.MongoDB)
        console.log("DB online (Mongo)")
        await basicCommandsEnabled()
    } catch (error) {
        console.log(error)
    }

    client.login(process.env.TOKEN);
})();