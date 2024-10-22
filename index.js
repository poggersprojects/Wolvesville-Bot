require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Load environment variables and log their status
const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

console.log('Environment variables loaded');
console.log(`API_URL: ${API_URL}, API_KEY: ${API_KEY ? 'Present' : 'Not Present'}, DISCORD_TOKEN: ${DISCORD_TOKEN ? 'Present' : 'Not Present'}`);
console.log(`CLIENT_ID: ${CLIENT_ID}, GUILD_ID: ${GUILD_ID}, CHANNEL_ID: ${CHANNEL_ID}`);

// Initialize the Discord client and specify intents
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});
console.log('Discord client initialized with required intents');

// Initialize the command collection and load commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
console.log(`Commands folder path: ${commandsPath}`);

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
console.log(`Found ${commandFiles.length} command files: ${commandFiles.join(', ')}`);

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
  console.log(`Command ${command.data.name} loaded successfully`);
}

// Log in to Discord and handle the ready event
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  
  // Get the specific channel using CHANNEL_ID and send a message
  const channel = client.channels.cache.get(CHANNEL_ID);
  if (channel) {
    console.log(`Channel with ID ${CHANNEL_ID} found`);
    await channel.send('The bot is now online! 🎉');
    console.log('Bot is online message sent successfully');
  } else {
    console.error(`Channel with ID ${CHANNEL_ID} not found. Ensure the CHANNEL_ID is correct.`);
  }
});

// Handle command interactions
client.on('interactionCreate', async interaction => {
  console.log(`Interaction created. Command name: ${interaction.commandName}, Interaction type: ${interaction.type}`);

  if (!interaction.isCommand()) {
    console.log('Interaction is not a command, ignoring.');
    return;
  }

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.log(`No command matching ${interaction.commandName} found`);
    return;
  }

  try {
    console.log(`Executing command: ${interaction.commandName}`);
    await command.execute(interaction, API_URL, API_KEY);
    console.log(`Command ${interaction.commandName} executed successfully`);
  } catch (error) {
    console.error(`Error executing command ${interaction.commandName}: ${error.message}`);

    // Handle deferred and non-deferred responses
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content: 'There was an error while executing this command!' });
      console.log(`Error message sent (editReply) for command ${interaction.commandName}`);
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      console.log(`Error message sent (reply, ephemeral) for command ${interaction.commandName}`);
    }
  }
});

// Log in to Discord using the token
client.login(DISCORD_TOKEN).then(() => {
  console.log('Discord login successful');
}).catch(error => {
  console.error(`Failed to login to Discord: ${error.message}`);
});
