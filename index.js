const Discord = require("discord.js");
const Revolt = require("revolt.js");
const config = require("./config.json");

// Just get all discord intents because fuck discord
const discord_intents = Object.values(Discord.Intents.FLAGS);

// Create clients
const d_client = new Discord.Client({ intents: discord_intents });
const r_client = new Revolt.Client();

// Log clients in
d_client.login(config.tokens.discord);
r_client.login(config.tokens.revolt);