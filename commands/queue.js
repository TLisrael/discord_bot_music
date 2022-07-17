const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("fila")
        .setDescription("mostrando 10 proximas musicas"),

    execute: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)

        // verifique se há músicas na fila
        if (!queue || !queue.playing)
        {
            await interaction.reply("Não há músicas na fila");
            return;
        }

        // Mostrando as 10 musicas que estão na fila
        const queueString = queue.tracks.slice(0, 10).map((song, i) => {
            return `${i+1} [${song.duration}] ${song.title} | <@${song.requestedBy.id}> |`
        }).join("\n")

        // Obter a música atual
        const currentSong = queue.current

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`**Tocando**\n\n` + 
                        (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} - | <@${currentSong.requestedBy.id}> | ` : "None") +
                        `\n\n**Fila**\n\n${queueString}`
                    )
                    .setThumbnail(currentSong.setThumbnail)
            ]
        })
    }
}