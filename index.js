require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashcommandBuilder } = require('discord.js');

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
    ],
});

// Function to fetch data from the Wolvesville API
async function fetchGet(endpoint) {
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

async function fetchPost(endpoint) {
    const fetch = (await import('node-fetch')).default;

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
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
client.once('ready', async (c) => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Bot ID: ${BOT_ID}`);
    console.log(`User ID: ${CLIENT_ID}`);

    // Fetch the channel and send a message
    const channel = c.channels.cache.get(CHANNEL_ID);
    if (channel) {
        await channel.send('The bot is now online! 🎉');
    } else {
        console.error(`Channel with ID ${CHANNEL_ID} not found.`);
    }
});

// Interaction handler
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong!');
    }

    if (commandName === 'redeemhat') {

        await interaction.deferReply(); // Acknowledge interaction immediately while processing

        try {
            fetchPost("/items/redeemApiHat");
            await interaction.editReply(`Thanks for sending me an item! Friendly regards - Freestyler_ 🎉`);
        } catch (error) {
            await interaction.editReply(`Failed to redeem hat: ${error.message}`);
        }
    }
});

// Log in to Discord
(async () => {
    await client.login(DISCORD_TOKEN);
})();
