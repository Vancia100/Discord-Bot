const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    guild: String,
    channel: String,
    minecraftIp: String,
    minecraftPort: String,
    minecraftMod: String,
})

module.exports = mongoose.model("Guilds", schema)