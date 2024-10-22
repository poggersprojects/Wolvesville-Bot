require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const channel = client.channels.cache.get(CHANNEL_ID);
    if (channel) {
        await channel.send('The bot is now online! 🎉');
    } else {
        console.error(`Channel with ID ${CHANNEL_ID} not found.`);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction, API_URL, API_KEY);
    } catch (error) {
        console.error(`Error executing command: ${error.message}`);

        if (interaction.deferred || interaction.replied) {
            await interaction.editReply({ content: 'There was an error while executing this command!' });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.login(DISCORD_TOKEN);
