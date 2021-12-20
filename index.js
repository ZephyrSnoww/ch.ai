const { Client } = require("ch.api.js");

const config = require("./config.json");

const client = new Client({});

client.on("ready", (client) => {
    console.log(`Logged into ${client.name.toUpperCase()}!`);
});

client.on("message", async (message, client) => {
    if (message.author === null || message.author.bot) { return; }
    // console.log(`${client.name} message: ${message.author.username} said "${message.content}"`);
    if (message.content === "ch.ping") {
        message.reply("Pong!");
    }
});

client.login({
    telegramToken: config.tokens.telegram,
    discordToken: config.tokens.discord,
    revoltToken: config.tokens.revolt
});