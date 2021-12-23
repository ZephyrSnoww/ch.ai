module.exports = {
    data: {
        name: "roll"
    },

    async execute(message, client) {
        let inputNumber = message.content.split(" ")[1];

        if (Number(inputNumber) == NaN || inputNumber == undefined) {
            return await message.reply("Please provide a valid number of sides!\nE.G. `roll 20`");
        }

        let number = Math.floor(Math.random() * Number(inputNumber)) + 1;
        await message.reply(`I rolled a${(inputNumber.startsWith("8") || inputNumber === "11" || inputNumber === "18") ? "n" : ""} ${number}!`);
    }
}