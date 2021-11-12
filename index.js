const { createCanvas } = require("canvas");

const Discord = require("discord.js");
const Revolt = require("revolt.js");
const axios = require("axios");
const fs = require("fs");

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
                                ▒▒                                
                    ▒▒        ▒▒        ▒▒                        
                  ▒▒        ▒▒        ▒▒                          
                  ▒▒        ▒▒        ▒▒                          
                    ▒▒        ▒▒        ▒▒                        
                      ▒▒        ▒▒        ▒▒                      
                        ▒▒        ▒▒        ▒▒                    
                          ▒▒        ▒▒        ▒▒                  
                          ▒▒        ▒▒        ▒▒                  
                        ░░        ░░        ░░                    
                      ░░        ▒▒        ░░                      
                                                                  
                                                                  
                      ▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒                      
                ▓▓▓▓▓▓                      ▓▓▓▓▓▓                
              ▓▓        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒        ▓▓              
            ██    ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒    ██            
            ▓▓██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▓▓            
            ▓▓  ▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓░░▓▓██████      
            ▓▓        ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓        ░░▓▓      ██    
            ▓▓                                    ░░▓▓██▒▒        
            ▓▓                                    ░░▓▓    ██    ▓▓
            ▓▓            CH.AI ONLINE            ░░▓▓    ▓▓    ▓▓
            ▓▓                                    ░░▓▓    ▓▓    ▓▓
            ▓▓                                    ░░▓▓▒▒▒▒▒▒░░░░░░
            ▓▓                                    ░░▓▓░░░░░░▒▒    
        ▒▒▒▒▓▓                                  ░░░░▓▓▓▓▓▓▓▓      
      ▒▒░░░░▓▓░░                                ░░░░▓▓░░░░░░▒▒    
    ▒▒░░      ▓▓░░                            ░░░░▓▓          ▒▒  
  ▓▓░░          ▓▓░░░░░░                  ░░░░░░▓▓            ░░▓▓
  ▓▓░░            ▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░▓▓▓▓              ░░▓▓
    ▓▓░░              ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                ░░▓▓  
      ▓▓░░░░░░                                        ░░░░░░▓▓    
        ▓▓▓▓██░░░░                            ░░░░░░░░▓▓▓▓▓▓      
              ▓▓▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░▓▓▓▓▓▓▓▓            
                    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                    

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

    // ==================================================
    // Ping command
    // ==================================================
    if (message.content == "ch.ping") {
        message.reply("Pong!");
        return console.log(`${message.author.username} pinged CH.AI!`);
    }

    // ==================================================
    // Invite command
    // ==================================================
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

    // ==================================================
    // Help command
    // ==================================================
    if (message.content == "ch.help") {
        let help_message;

        if (client == "discord") {
            help_message = `
ch.help ................ This command
ch.ping ................ Ping CH.AI
ch.invite .............. Invite CH.AI to a server

ch.wallhaven ........... Get a random wallpaper from wallhaven
ch.wallhaven <search> .. Get a wallhaven wallpaper with a search
\`\`\``;
        } else if (client == "revolt") {
            help_message = `\`\`\`
# Basics
| Command | Function |
| ------- | -------- |
| ch.help | This command |
| ch.ping | Ping CH.AI |
| ch.invite | Invite CH.AI to a server |

# API Functionality
| Command | Function |
| ------- | -------- |
| ch.wallhaven | Get a random wallpaper from wallhaven |
| ch.wallhaven <search> | Get a wallhaven wallpaper with a search |`;
        }

        message.reply(`\`\`\`
      ██    ██    ██                                    
    ██      ██  ██                                      
    ██    ██    ██                                      
      ██  ██      ██                                    
      ██    ██    ██                                    
                                                        
  ████████████████████                                  
  ██                ██████                              
  ██     CHAT       ██  ██                              
  ██  APPLICATION   ██  ██                              
  ██   INTERFACE    ██████                              
    ██            ██                                    
████████████████████████                                
██                    ██                                
  ████████████████████
${help_message}`);
        return console.log(`${message.author.username} got CH.AI help!`);
    }

    // ==================================================
    // Wallhaven command
    // ==================================================
    if (message.content.startsWith("ch.wallhaven")) {
        if (message.content == "ch.wallhaven") {
            axios.get("https://wallhaven.cc/api/v1/search?sorting=random").then(response => {
                message.reply(response.data.data[0].url);
                return console.log(`${message.author.username} made a wallhaven request!`);
            });
        }
        else {
            let search = message.content.replace("ch.wallhaven ", "");
            axios.get(`https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(search)}&sorting=random`).then(response => {
                message.reply(response.data.data[0].url);
                return console.log(`${message.author.username} did a wallhaven search!`);
            });
        }
    }

    // ==================================================
    // Colormind command
    // ==================================================
    if (message.content.startsWith("ch.colormind")) {
        if (message.content == "ch.colormind") {
            axios.post("http://colormind.io/api/", { model: "default" }).then(response => {
                const colors = response.data.result;
                const canvas = createCanvas(50 * colors.length, 50);
                const context = canvas.getContext("2d");

                for (let i = 0; i < colors.length; i++) {
                    context.fillStyle = `rgb(${colors[i].join(", ")})`;
                    context.fillRect(50 * i, 0, 50 * (i + 1), 50);
                }

                const buffer = canvas.toBuffer("image/png");
                const attachment = new Discord.MessageAttachment(buffer, "colormind.png");

                message.reply({files: [attachment]});
                return console.log(`${message.author.username} got a random colormind pallette!`);
            });
        }
    }
}