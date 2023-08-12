const {ApplicationCommandOptionType, interaction, PermissionFlagsBits} = require("discord.js")
const db = require("../Schemas/guildSchema")

module.exports = {
    code: 
    /**
     * 
     * @param {interaction} interaction 
     */
    async (interaction) => {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        interaction.reply({
            content:"This command is only for admins",
            ephemeral:true
        })
    }
        const serverIp = interaction.options.get("server-ip")
        const serverPort = interaction.options.get("server-port") ? interaction.options.get("server-port").value : 25565
        const serverMod = interaction.options.get("server-mod")

        if (!serverIp || !serverPort || !serverMod) {
            interaction.reply({
                content:"Not all fields have been supplied!",
                ephemeral:true
            })
            return;
        }

        const guild = await db.findOne({guild: interaction.guildId})
        if (!guild) {
            interaction.reply({
                content:"This server is not in the database, run /init to fix that!",
                ephemeral:true
            })
            return;
        }
        

        guild.minecraftPort = serverPort
        guild.minecraftIp = serverIp.value
        guild.minecraftMod = serverMod.value
try {
    await guild.save()
    interaction.reply("The minecraft server has been updated")
} catch (error) {
    console.log(error)
    interaction.reply({
        content:"There was an error saving to the database",
        ephemeral: true,
    })
}
        
    },
    command: {
        name: "init-server",
        description: "Set up the minecraft server to use for /ping",
        options: [
            {
                name: "server-ip",
                description:"The IP for the server",
                type: ApplicationCommandOptionType.String,
                required:true
            },
            {
                name:"server-mod",
                description:"The user in charge for the server",
                type: ApplicationCommandOptionType.User,
                required:true
            },
            {
                name:"server-port",
                description:"The port the server uses",
                type: ApplicationCommandOptionType.Integer,
                default:false
            },
        ]
    }
}