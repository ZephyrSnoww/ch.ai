module.exports = {
    data: {
        name: "help",
        arguments: "",
        description: "List all commands and their usage"
    },

    async execute(message, client) {
        // Load command files
        const commandFiles = fs.readdirSync("./").filter(file => file.endsWith(".js"));
        let commands = {};
        let output = [];

        for (const file of commandFiles) {
            const command = require(`./${file}`);
            commands[command.data.name] = command;
        }

        for (let [commandName, command] of Object.entries(commands)) {
            output.push(`**ch.${commandName}** ${command.data.arguments} - ${command.data.description}`);
        }

        message.reply(output.join("\n"));
    }
}