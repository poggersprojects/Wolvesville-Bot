const { SlashCommandBuilder } = require('discord.js');
const { config } = require('dotenv');

// Load environment variables from the .env file
config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('msg')
    .setDescription('Send a message to the Wolvesville clan chat')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Enter your message')
        .setRequired(true)
        .setMaxLength(100)),
  
  async execute(interaction) {
    await interaction.deferReply(); // Inform Discord that you're processing the command

    const message = interaction.options.getString('message');
    const CLAN_ID = process.env.CLAN_ID; // Get CLAN_ID from environment variables
    const API_URL = `${process.env.API_URL}/clans/${CLAN_ID}/chat`; // Construct the API URL
    const API_KEY = process.env.API_KEY; // Get API_KEY from environment variables

    try {
      const { default: fetch } = await import('node-fetch'); // Dynamically import fetch

      const body = JSON.stringify({ message }); // Prepare the request body

      // Make the POST request
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bot ${API_KEY}`, // Set the authorization header
        },
        body // Pass the body containing the message
      });

      // Check for a successful response
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      // Confirm to the user that the message was sent
      await interaction.editReply({ content: 'Message sent to clan chat!' });
    } catch (error) {
      // Log any errors and inform the user
      console.error('Error sending message to Wolvesville chat:', error);
      await interaction.editReply({ content: 'Failed to send message to clan chat. Please try again later.' });
    }
  },
};
