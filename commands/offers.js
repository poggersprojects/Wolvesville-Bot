const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Function to get the active shop offers using Wolvesville API
async function fetchShopOffers(API_URL, API_KEY) {
    const fetch = (await import('node-fetch')).default;

    try {
        const response = await fetch(`${API_URL}/shop/activeOffers`, {
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
        console.error(`Error fetching shop offers: ${error.message}`);
        return null;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shopoffers')
        .setDescription('Shows the current active shop offers in Wolvesville.'),
    async execute(interaction, API_URL, API_KEY) {
        // Fetch the active offers
        const shopOffers = await fetchShopOffers(API_URL, API_KEY);

        if (!shopOffers || shopOffers.length === 0) {
            await interaction.reply('There are no active shop offers at the moment.');
            return;
        }

        // For simplicity, let's just show the first offer in the response
        const offer = shopOffers[0];

        const embed = new EmbedBuilder()
            .setTitle('Active Shop Offer')
            .setDescription(`**Type:** ${offer.type}\n**Cost in Gems:** ${offer.costInGems}\n**Expires on:** ${new Date(offer.expireDate).toLocaleString()}`)
            .setImage(offer.promoImageUrl) // Embed the promo image
            .setColor(0x00FF00); // Set the color of the embed

        await interaction.reply({ embeds: [embed] });
    },
};
