module.exports = {
    data: {
        name: "ping",
        arguments: "",
        description: "Ping the bot"
    },

    async execute(message, client) {
        message.reply(`Pong!\nHello, ${message.author.username}!\nI see that you're using ${client.name}!`);
    }
}