const { createCanvas } = require("canvas");
const axios = require("axios");

module.exports = {
    data: {
        name: "colormind",
        arguments: "",
        description: "Create a color palette with the colormind.io API"
    },

    async execute(message, client) {
        axios.post("http://colormind.io/api/", { model: "default" }).then((response) => {
            const colors = response.data.result;
            const canvas = createCanvas(50 * colors.length, 50);
            const context = canvas.getContext("2d");

            for (let i = 0; i < colors.length; i++) {
                context.fillStyle = `rgb(${colors[i].join(", ")})`;
                context.fillRect(50 * i, 0, 50 * (i + 1), 50);
            }

            const buffer = canvas.toBuffer("image/png");
        });
        message.reply(`Pong!\nHello, ${message.author.username}!\nI see that you're using ${client.name}!`);
    }
}