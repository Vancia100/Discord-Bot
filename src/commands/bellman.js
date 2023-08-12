const fs = require("fs");
const {ApplicationCommandOptionType, interaction} = require("discord.js")
module.exports = {
    command:
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
    code:
    /**
     * 
     * @param {interaction} interaction 
     */

    (interaction) => {
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
    },
}


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