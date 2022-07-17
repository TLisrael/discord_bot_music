const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("skippado")
        .setDescription("Pule a música atual"),

	execute: async ({ client, interaction }) => {

        // Obter a fila para o servidor
		const queue = client.player.getQueue(interaction.guildId)

        // Se não houver fila, retorne
		if (!queue)
        {
            await interaction.reply("Não há música para ser pulada");
            return;
        }

        const currentSong = queue.current

        // pular a música atual
		queue.skip()

        // Retornar ao usuário dizendo que a música foi pulada
        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`${currentSong.title} foi pulada`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
	},
}
