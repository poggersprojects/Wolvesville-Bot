const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

// Function to search for clans using the Wolvesville API
async function searchClan(clanName, API_URL, API_KEY) {
    try {
        const response = await fetch(`${API_URL}/clans/search?name=${clanName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bot ${API_KEY}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching clan data: ${error.message}`);
        return null;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('searchclan')
        .setDescription('Search for a Wolvesville clan by name.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the clan')
                .setRequired(true)),
    async execute(interaction, API_URL, API_KEY) {
        const clanName = interaction.options.getString('name');

        // Call the API to search for clans
        const clanData = await searchClan(clanName, API_URL, API_KEY);

        if (!clanData || clanData.length === 0) {
            await interaction.reply('No clans found with that name.');
        } else {
            const clan = clanData[0];  // Return the first result for simplicity
            await interaction.reply(`**Clan Name:** ${clan.name}\n**Description:** ${clan.description}\n**XP:** ${clan.xp}\n**Join Type:** ${clan.joinType}\n**Language:** ${clan.language}\n**Member Count:** ${clan.memberCount}`);
        }
    },
};
