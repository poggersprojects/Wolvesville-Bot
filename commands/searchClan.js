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

            // Create an embed to display the results
            const embed = new EmbedBuilder()
                .setTitle(`Search Results for "${clanName}"`)
                .setDescription(`Found ${clanCount} clan(s).`);

            // Add fields for each clan
            for (const clan of clanData) {
                embed.addFields([
                    { name: 'Name', value: clan.name, inline: true },
                    { name: 'Description', value: clan.description, inline: true },
                    // Add other fields as needed
                ]);
            }

            // Create buttons for navigation
            const previousButton = new ButtonBuilder()
                .setCustomId('previous')
                .setLabel('Previous')
                .setStyle('Primary')
                .setDisabled(page === 1);
            const nextButton = new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Next')
                .setStyle('Primary')
                .setDisabled(page === totalPages);
            const row = new ActionRowBuilder()
                .addComponents(previousButton, nextButton);

            await interaction.reply({ embeds: [embed], components: [row] });
        }
    },
};
