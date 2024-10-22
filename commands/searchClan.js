const { SlashCommandBuilder, ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');

// Function to search for clans using the Wolvesville API
async function searchClan(clanName, API_URL, API_KEY, page, pageSize) {
    const fetch = (await import('node-fetch')).default;

    try {
        const response = await fetch(`${API_URL}/clans/search?name=${clanName}&page=${page}&pageSize=${pageSize}`, {
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
        const pageSize = 1; // Adjust the page size as needed
        const page = 1;

        // Call the API to search for clans
        const clanData = await searchClan(clanName, API_URL, API_KEY, page, pageSize);

        if (!clanData || clanData.length === 0) {
            await interaction.reply('No clans found with that name.');
        } else {
            const clanCount = clanData.length;
            const totalPages = Math.ceil(clanCount / pageSize);
        }
    }
};
