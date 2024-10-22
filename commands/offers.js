const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

// Function to fetch the current shop offers from the Wolvesville API
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
        await interaction.deferReply(); // Defers the reply to avoid timeouts

        const offersData = await fetchShopOffers(API_URL, API_KEY);
        if (!offersData || offersData.length === 0) {
            await interaction.editReply('No offers available at this time.');
            return;
        }

        let currentPage = 0;
        const totalPages = offersData.length;

        const generateEmbed = (offer) => {
            const embed = new EmbedBuilder()
                .setTitle(`Offer #${currentPage + 1}`)
                .setDescription(`**Cost in Gems:** ${offer.costInGems}\n**Expires:** <t:${Math.floor(new Date(offer.expireDate).getTime() / 1000)}:R>`)
                .setImage(offer.promoImageUrl)
                .setColor(0x00AE86);
            return embed;
        };

        const generateButtons = () => {
            const prevButton = new ButtonBuilder()
                .setCustomId('prev')
                .setLabel('Previous')
                .setStyle(1) // Primary
                .setDisabled(currentPage === 0);

            const nextButton = new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Next')
                .setStyle(1) // Primary
                .setDisabled(currentPage === totalPages - 1);

            return new ActionRowBuilder().addComponents(prevButton, nextButton);
        };

        const updateReply = async () => {
            const embed = generateEmbed(offersData[currentPage]);
            const buttons = generateButtons();
            await interaction.editReply({ embeds: [embed], components: [buttons] });
        };

        // Initial reply
        await updateReply();

        // Create a message collector to listen for button clicks
        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (buttonInteraction) => {
            if (buttonInteraction.customId === 'next') {
                currentPage++;
            } else if (buttonInteraction.customId === 'prev') {
                currentPage--;
            }
            await buttonInteraction.deferUpdate(); // Defer the button interaction to avoid timeouts
            await updateReply(); // Update the embed and buttons based on the new page
        });

        collector.on('end', async () => {
            // Disable the buttons once the collector ends
            const embed = generateEmbed(offersData[currentPage]);
            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel('Previous')
                    .setStyle(1)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Next')
                    .setStyle(1)
                    .setDisabled(true)
            );
            await interaction.editReply({ embeds: [embed], components: [buttons] });
        });
    }
};
