const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("retornar")
        .setDescription("Retomar a música"),
	execute: async ({ client, interaction }) => {
        // Obter a fila para o servidor
		const queue = client.player.getQueue(interaction.guildId)

        // verifique se a fila está vazia
		if (!queue)
        {
            await interaction.reply("No songs in the queue");
            return;
        }

        // Pausar a música atual
		queue.setPaused(false);

        await interaction.reply("Player has been resumed.")
	},
}