const {REST, Routes, Options, ApplicationCommandOptionType} = require("discord.js");
require("dotenv").config();

const commands = [
    [{
        name:"init",
        description:"The initial setup required to make the bot work on this server",
        options:[
        {
        name:"channel",
        description: "What channel to use to send commands",
        type:ApplicationCommandOptionType.Channel,
        },]
        },
        {
            name:"test",
            description:"Does absolutely nothing"
        }
    ]
];

const rest = new REST({ version: "10"}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Registering slash commads")
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.Client_id, 
                process.env.Guild_id
            ),
            {body: commands}
        )

        console.log("Klarade det!")
    } catch (error) {
        console.log(`Error: ${error}`)
    }
})();
