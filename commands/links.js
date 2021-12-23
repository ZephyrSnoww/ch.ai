module.exports = {
    data: {
        name: "links",
        arguments: "",
        description: "Get all support server and bot invite links"
    },

    async execute(message, client) {
        const config = require("../config.json");
        let outputStrings = [];

        for (let [key, value] of Object.entries(config.invites)) {
            outputStrings.push(`**${key} Bot Invite:** ${value}`);
        }

        outputStrings.push("");

        for (let [key, value] of Object.entries(config.supportServers)) {
            outputStrings.push(`**${key} Support Server:** ${value}`);
        }
        
        message.reply(outputStrings.join("\n"));
    }
}