require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;
const BOT_ID = process.env.BOT_ID;

async function fetchData(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bot ${API_KEY}`,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});


