const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

async function fetchPlayerByUsername(API_URL, API_KEY, username) {
    const fetch = (await import('node-fetch')).default;

    try {
        const response = await fetch(`${API_URL}/players/search?username=${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bot ${API_KEY}`,
            },
        });

        if (response.status === 404) {
            throw new Error('Player not found');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching player: ${error.message}`);
        return null;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('searchplayer')
        .setDescription('Search for a player by username.')
        .addStringOption(option => 
            option.setName('username')
                .setDescription('The username of the player to search for')
                .setRequired(true)),
    
    async execute(interaction, API_URL, API_KEY) {
        const username = interaction.options.getString('username');

        await interaction.deferReply();

        const playerData = await fetchPlayerByUsername(API_URL, API_KEY, username);
        
        if (!playerData) {
            await interaction.editReply('Could not find player data. Please check the username and try again.');
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`Player Info: ${playerData.username}`)
            .setColor(0x00AE86)
            .setThumbnail(playerData.equippedAvatar.url)
            .addFields(
                { name: 'Level', value: playerData.level.toString(), inline: true },
                { name: 'Status', value: playerData.status, inline: true },
                { name: 'Personal Message', value: playerData.personalMessage || 'No message set', inline: false },
                { name: 'Last Online', value: new Date(playerData.lastOnline).toLocaleString(), inline: false },
                { name: 'Total Wins', value: playerData.gameStats.totalWinCount.toString(), inline: true },
                { name: 'Total Losses', value: playerData.gameStats.totalLoseCount.toString(), inline: true },
                { name: 'Total Ties', value: playerData.gameStats.totalTieCount.toString(), inline: true },
                { name: 'Ranked Best Rank', value: playerData.rankedSeasonBestRank.toString(), inline: true },
                { name: 'Received Roses', value: playerData.receivedRosesCount.toString(), inline: true },
                { name: 'Sent Roses', value: playerData.sentRosesCount.toString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Player ID: ${playerData.id}`, iconURL: playerData.equippedAvatar.url });

        await interaction.editReply({ embeds: [embed] });
    }
};
