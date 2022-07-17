const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Ouça uma musica do youtube")
		.addSubcommand(subcommand =>
			subcommand
				.setName("search")
				.setDescription("Pesquise uma música")
				.addStringOption(option =>
					option.setName("searchterms").setDescription("procurar palvras chave").setRequired(true)
				)
		)
        .addSubcommand(subcommand =>
			subcommand
				.setName("playlist")
				.setDescription("Ouça uma playlist do youtube")
				.addStringOption(option => option.setName("url").setDescription("Url da playlist").setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("song")
				.setDescription("Ouça apenas uma música do youtube")
				.addStringOption(option => option.setName("url").setDescription("url da música").setRequired(true))
		),
	execute: async ({ client, interaction }) => {
        // tenha ctz de que o user ta em um canal de voz
		if (!interaction.member.voice.channel) return interaction.reply("Você precisa estar em um canal de voz para ouvir suas musicas");

        // criando fila para servidor
		const queue = await client.player.createQueue(interaction.guild);

        // Aguarde até que user esteja conectado ao canal
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

		let embed = new MessageEmbed()

		if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")
            
            // Procure a música usando o discord-player
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })

            // finalize se nao achar as musicas
            if (result.tracks.length === 0)
                return interaction.reply("Sem resultado")

            // adiciona a musica na fila
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** Foi adicionado com sucesso a lista`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})

		}
        else if (interaction.options.getSubcommand() === "playlist") {

            // Procure a lista de reprodução usando o discord-player
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            if (result.tracks.length === 0)
                return interaction.reply(`Não foi encontrada nenhuma playlist ${url}`)
            
            // Add the tracks to the queue
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setDescription(`**${result.tracks.length} As musicas de [${playlist.title}](${playlist.url})** foram adicionadas com sucesso`)
                .setThumbnail(playlist.thumbnail)

		} 
        else if (interaction.options.getSubcommand() === "search") {

            // Procure a música usando o discord-player
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            // finalize se não encontrar
            if (result.tracks.length === 0)
                return interaction.editReply("Sem resultados")
            
            // adicionando musicas na fila
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** Foi adicionado a playlist`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duração: ${song.duration}`})
		}

        // play
        if (!queue.playing) await queue.play()
        
        // Responda contendo informações sobre o player
        await interaction.reply({
            embeds: [embed]
        })
	},
}