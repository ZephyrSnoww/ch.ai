const Discord = require("discord.js");
const Revolt = require("revolt.js");
const config = require("./config.json");

// Just get all discord intents because fuck discord
const discord_intents = Object.values(Discord.Intents.FLAGS);

// Create clients
const clients = {
    discord: {
        client: new Discord.Client({ intents: discord_intents }),
        message_event: "messageCreate",
        login: function() {
            this.client.login(config.tokens.discord);
        }
    },
    revolt: {
        client: new Revolt.Client(),
        message_event: "message",
        login: function() {
            this.client.loginBot(config.tokens.revolt);
        }
    }
}

// Log clients in
for (let client in clients) {
    clients[client].login();
}

// Keep track of how many clients are ready
let total_clients = Object.keys(clients).length;
let clients_ready = 0;

// ==================================================
// On clients ready
// ==================================================
for (let client in clients) {
    clients[client].client.on("ready", () => {
        clients_ready += 1;
        console.log(`CH.AI ${client} client online!`);
        if (clients_ready == total_clients) {
            ready_up();
        }
    });
}

// Fancy terminal output on startup
function ready_up() {
    console.log(`
                      (
                        )     (
                 ___...(-------)-....___
             .-""       )    (          ""-.
       .-'\`\`'|-._             )         _.-|
      /  .--.|   \`""---...........---""\`   |
     /  /    |                             |
     |  |    |                             |
      \\  \\   |                             |
       \`\\ \`\\ |    ===> CH.AI ONLINE <===   |
         \`\\ \`|                             |
         _/ /\\                             /
        (__/  \\                           /
     _..---""\` \\                         /\`""---.._
  .-'           \\                       /          '-.
 :               \`-.__             __.-'              :
 :                  ) ""---...---"" (                 :
  '._               \`"--...___...--"\`              _.'
    \\""--..__                              __..--""/
     '._     """----.....______.....----"""     _.'
        \`""--..,,_____            _____,,..--""\`
                      \`"""----"""\`
    
=== BEGINNING LOG ===`);
}

// ==================================================
// On client message
// ==================================================
for (let client in clients) {
    clients[client].client.on(clients[client].message_event, (message) => {
        handleMessage(message, client);
    });
}

// ==================================================
// Handling messages
// ==================================================
async function handleMessage(message, client) {
    if ([Object.keys(clients).forEach((client) => { return clients[client].client.user.username })].includes(message.author.username)) { return false; }
    if (message.author.bot) { return false; }

    if (message.content == "ch.ping") {
        message.reply("Pong!");
        return console.log(`${message.author.username} pinged CH.AI!`);
    }

    if (message.content == "ch.invite") {
        let response;

        if (client == "discord") {
            response = `__**Discord Invite Link:**__ ${config.invites.discord}\n__**Revolt Invite Link:**__ ${config.invites.revolt}`;
        } else if (client == "revolt") {
            response = `[Revolt Invite](${config.invites.revolt})\n[D*scord Invite](${config.invites.discord})`;
        }

        message.reply(response);
        return console.log(`${message.author.username} got CH.AI invite links!`);
    }
}