const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("shut")
        .setDescription("Pause a música que está tocando"),
	execute: async ({ client, interaction }) => {
        // obter a fila para o servidor
		const queue = client.player.getQueue(interaction.guildId)

        // verifique se a fila está vazia
		if (!queue)
		{
			await interaction.reply("Não há musicas na fila")
			return;
		}

        // Pausar a música atual
		queue.setPaused(true);

        await interaction.reply("Música pausada")
	},
}