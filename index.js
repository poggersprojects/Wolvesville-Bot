require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField, Permissions, SlashCommandBuilder } = require('discord.js');

// Environment variables
const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;
const BOT_ID = process.env.BOT_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

// Create a new Discord client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildGuilds, 
        GatewayIntentBits.Channel, 
        PermissionsBitField, 
        Permissions, 
        SlashCommandBuilder
    ],
});

// Function to fetch data from the Wolvesville API
async function fetchData(endpoint) {
    const fetch = (await import('node-fetch')).default;

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bot ${API_KEY}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
        throw error; // Re-throw the error for further handling
    }
}

// Event: Bot is ready
client.once('ready', (c), async () => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Bot ID: ${BOT_ID}`);
    console.log(`User ID: ${CLIENT_ID}`);

    // Fetch the channel and send a message
    const channel = c.channels.cache.get(CHANNEL_ID);
    if (channel) {
        await channel.send('The bot is now online! 🎉');
    } else {
        console.error(`Channel with ID ${channelId} not found.`);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong!');
    }
});

// Log in to Discord
(async () => {
    await client.login(DISCORD_TOKEN);
})();
