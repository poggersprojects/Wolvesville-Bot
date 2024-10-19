require('dotenv').config();
const { REST, Routes } = require('discord.js');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const commands = [
    {
        name: 'ping',
        description: 'Replies with "Pong!"',
    },
    {
        name: 'searchclanbyname',
        description: 'Searches for a clan by its name.',
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
