require('dotenv').config();
const { REST, Routes } = require('discord.js');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

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
                type: 3,
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
                type: 3,
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
                type: 3,
                required: true
            }
        ]
    }
];

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
    try {
        console.log(`Registering slash commands...`);

        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });

        console.log(`Successfully registered ${commands.length} slash commands.`);
    } catch (err) {
        console.log(`Error: ${err}`);
    }
})();
