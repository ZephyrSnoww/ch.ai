const { Client } = require("ch.api.js");
const fs = require("fs");

// Load config
const config = require("./config.json");

// Create a new client
const client = new Client({
    prefix: "ch."
});

// Load command files
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
client.commands = new Map();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// When ready
client.on("ready", (client) => {
    console.log(`Logged into ${client.name}!`);
});

// When a message is recieved
client.on("message", async (message, clientFrom) => {
    // If the message doesnt have an author (was sent by a webhook on discord)
    // Or the author is a bot, stop
    if (message.author === null || message.author.bot) { return; }

    // If the message doesnt start with the clients prefix, stop
    if (!message.content.startsWith(client.prefix)) { return; }

    // Get the command the user did
    const command = client.commands.get(message.content.split(" ")[0].split(".")[1]);

    // If the command doesnt exist, stop
    if (!command) { return; }

    // Try to execute the command
    try {
        await command.execute(message, clientFrom);
    // Tell the user if an error happens
    } catch (error) {
        if (error) { console.error(error); }
        message.reply(`There was an error while executing this command!`);
    }
});

// Login
client.login({
    telegramToken: config.tokens.Telegram,
    discordToken: config.tokens.Discord,
    revoltToken: config.tokens.Revolt
});