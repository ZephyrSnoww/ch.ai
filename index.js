const { Client } = require("ch.api.js");
const fs = require("fs");

// Load config
const config = require("./config.json");

// Create a new client
const client = new Client({
    prefix: "ch.",
    telegramOwner: "sv_145",
    discordOwner: "184474965859368960",
    revoltOwner: "01FM118Q3W39W1RD76AYRPMA30"
});

// Load command files
let commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
client.commands = new Map();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Function for checking if a user is the bot owner
function isOwner(user) {
    return (user.id == client.telegramOwner) || (user.id == client.discordOwner) || (user.id == client.revoltOwner);
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

    if (message.content === `${client.prefix}reload`) {
        if (!isOwner(message.author)) {
            return message.reply(`You must be the bot owner to do that command!`);
        }

        commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
        client.commands = new Map();

        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            client.commands.set(command.data.name, command);
        }

        return message.reply(`ch.ai has been reloaded!`);
    }

    // Get the command the user did
    const command = client.commands.get(message.content.split(" ")[0].split(".")[1]);

    // If the command doesnt exist, stop
    if (!command) { return; }

    // If the command is owner only
    if (command.data.ownerOnly) {
        if (!isOwner(message.author)) {
            return message.reply(`You must be the bot owner to do that command!`);
        }
    }

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