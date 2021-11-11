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
r_client.loginBot(config.tokens.revolt);

// Keep track of how many clients are ready
let total_clients = 2;
let clients_ready = 0;

// ==================================================
// On clients ready
// ==================================================
d_client.on("ready", () => {
    clients_ready += 1;
    console.log(`CH.AI Discord client online!`);
    if (clients_ready == total_clients) {
        ready_up();
    }
});
r_client.on("ready", () => {
    clients_ready += 1;
    console.log(`CH.AI Revolt client online!`);
    if (clients_ready == total_clients) {
        ready_up();
    }
});

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
d_client.on("message", (message) => {
    handleMessage(message, "discord");
});
r_client.on("message", (message) => {
    handleMessage(message, "revolt");
});

// ==================================================
// Handling messages
// ==================================================
async function handleMessage(message, client) {
    if ([d_client.user.username, r_client.user.username].includes(message.author.username)) { return false; }

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