const { Client } = require("ch.api.js");
const fs = require("fs");

// Load config
const config = require("./config.json");

// Create a new client
const client = new Client({});
client.prefix = "ch.";

// Load command files
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
client.commands = new Map();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// When ready
client.on("ready", (client) => {
    console.log(`Logged into ${client.name.toUpperCase()}!`);
});

// When a message is recieved
client.on("message", async (message, clientFrom) => {
    if (message.author === null || message.author.bot) { return; }

    if (!message.content.startsWith(client.prefix)) { return; }
    const command = client.commands.get(message.content.split(" ")[0].split(".")[1]);

    if (!command) { return; }

    try {
        await command.execute(message, clientFrom);
    } catch (error) {
        if (error) { console.error(error); }
        message.reply(`There was an error while executing this command!`);
    }
});

// Login
client.login({
    telegramToken: config.tokens.telegram,
    discordToken: config.tokens.discord,
    revoltToken: config.tokens.revolt
});