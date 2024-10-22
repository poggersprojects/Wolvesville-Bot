const { SlashCommandBuilder, ButtonBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

async function searchClan(clanName, API_URL, API_KEY) {
    const fetch = (await import('node-fetch')).default;

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

function generateClanEmbed(clanData, currentPage, totalPages) {
    const clan = clanData[currentPage];
    return new EmbedBuilder()
        .setTitle(clan.name)
        .setDescription(clan.description || 'No description available')
        .addFields(
            { name: 'XP', value: clan.xp.toString(), inline: true },
            { name: 'Join Type', value: clan.joinType, inline: true },
            { name: 'Language', value: clan.language, inline: true },
            { name: 'Member Count', value: clan.memberCount.toString(), inline: true }
        )
        .setFooter({ text: `Page ${currentPage + 1} of ${totalPages} | Clan ID: ${clan.id}` });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('searchclan')
        .setDescription('Search for a Wolvesville clan by name.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the clan')
                .setRequired(true)
        ),
    async execute(interaction, API_URL, API_KEY) {
        const clanName = interaction.options.getString('name');

        const clanData = await searchClan(clanName, API_URL, API_KEY);

        if (!clanData || clanData.length === 0) {
            await interaction.reply('No clans found with that name.');
            return;
        }

        let currentPage = 0;
        const totalPages = clanData.length;

        const embed = generateClanEmbed(clanData, currentPage, totalPages);

        const prevButton = new ButtonBuilder()
            .setCustomId('prev')
            .setLabel('Previous')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);

        const nextButton = new ButtonBuilder()
            .setCustomId('next')
            .setLabel('Next')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(totalPages === 1);

        const row = new ActionRowBuilder().addComponents(prevButton, nextButton);

        const message = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

        const collector = message.createMessageComponentCollector({
            time: 1800000,
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: 'You cannot interact with this button!', ephemeral: true });
            }

            if (i.customId === 'next' && currentPage < totalPages - 1) {
                currentPage++;
            } else if (i.customId === 'prev' && currentPage > 0) {
                currentPage--;
            }

            const newEmbed = generateClanEmbed(clanData, currentPage, totalPages);
            prevButton.setDisabled(currentPage === 0);
            nextButton.setDisabled(currentPage === totalPages - 1);

            await i.update({ embeds: [newEmbed], components: [new ActionRowBuilder().addComponents(prevButton, nextButton)] });
        });

        collector.on('end', collected => {
            prevButton.setDisabled(true);
            nextButton.setDisabled(true);
            interaction.editReply({ components: [new ActionRowBuilder().addComponents(prevButton, nextButton)] });
        });
    }
};
