const {REST, Routes, Options, ApplicationCommandOptionType} = require("discord.js");
require("dotenv").config();

const commands = [
    {
        name: "ping",
        description: "status på minecraft servern"
    },
    {
        name:"bellman",
        description: "Gissa 3 gånger vad den gör...",
        options: [
            {
                name: "add",
                description: "Lägg till yterligare en masterpiece",
                type: ApplicationCommandOptionType.String,
            }
        ]
    },
    {
        name:"initserver",
        description: "Initiates a Minecraft server to this discord server",
        options: [
            {
            name:"server-ip",
            description: "What is the server IP?",
            type: ApplicationCommandOptionType.String,
            require:true
            },
            {name:"server-mod", 
            description: "Who is modderation this server?",
            type: ApplicationCommandOptionType.User,
            require: true
            }
            ]
    }
];

const rest = new REST({ version: "10"}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Registering slash commads")
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.Client_id, 
                process.env.Guild_id2
            ),
            {body: commands}
        )

        console.log("Klarade det!")
    } catch (error) {
        console.log(`Error: ${error}`)
    }
})();