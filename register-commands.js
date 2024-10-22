require('dotenv').config();
const { REST, Routes } = require('discord.js');

// Load environment variables and log their presence
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

console.log('Environment variables loaded');
console.log(`DISCORD_TOKEN: ${DISCORD_TOKEN ? 'Present' : 'Not Present'}, CLIENT_ID: ${CLIENT_ID}, GUILD_ID: ${GUILD_ID}`);

// Define the commands
const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'searchclan',
        description: 'Search for a Wolvesville clan by name.',
        options: [
            {
                name: 'name',
                description: 'The name of the clan',
                type: 3, // String type
                required: true
            }
        ]
    },
    {
        name: 'shopoffers',
        description: 'Shows the current active shop offers in Wolvesville.',
    },
    {
        name: 'searchplayer',
        description: 'Search for a player by username.',
        options: [
            {
                name: 'username',
                description: 'The username of the player to search for',
                type: 3, // String type
                required: true
            }
        ]
    },
    {
        name: 'msg',
        description: 'Send a message to the Wolvesville clan',
        options: [
            {
                name: 'message',
                description: 'The message you want to send',
                type: 3, // String type
                required: true
            }
        ]
    }
];

// Initialize the REST API client and log token presence
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);
console.log('REST client initialized with version 10 and token set');

// Register the commands asynchronously
(async () => {
    try {
        console.log('Attempting to register slash commands...');
        console.log(`Slash commands to register: ${commands.map(command => command.name).join(', ')}`);

        // Register commands to the guild
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), 
            { body: commands }
        );
        console.log(`Successfully registered ${commands.length} slash commands to guild ${GUILD_ID}`);
    } catch (err) {
        console.error('Error occurred while registering slash commands:', err);
    }
})();
