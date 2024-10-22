const { SlashCommandBuilder } = require('discord.js');
const { config } = require('dotenv');

config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('msg')
    .setDescription('Send a message to the Wolvesville clan chat')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Enter your message')
        .setRequired(true)
        .setMaxLength(500)),

  async execute(interaction) {
    console.log('msg command execution started');

    try {
      await interaction.deferReply();
      console.log('Interaction deferred');

      const message = interaction.options.getString('message');
      console.log('Message received:', message);

      const username = interaction.user.username;
      console.log('Username:', username);

      const formattedMessage = `${username}: ${message}`;
      console.log('Formatted message:', formattedMessage);

      const CLAN_ID = process.env.CLAN_ID;
      const API_URL = process.env.API_URL;
      const API_KEY = process.env.API_KEY;

      console.log(`Environment Variables - CLAN_ID: ${CLAN_ID}, API_URL: ${API_URL}, API_KEY: ${API_KEY ? 'Present' : 'Not Present'}`);

      const { default: fetch } = await import('node-fetch');
      const body = JSON.stringify({ message: formattedMessage });

      console.log('Request body prepared:', body);

      const response = await fetch(`${API_URL}/clans/${CLAN_ID}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bot ${API_KEY}`,
        },
        body,
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      await interaction.editReply({ content: 'Message sent to clan chat!' });
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message to Wolvesville chat:', error);

      // Ensure to edit the deferred reply in case of error
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: 'Failed to send message to clan chat. Please try again later.' });
        console.log('Error message sent');
      } else {
        await interaction.reply({ content: 'Failed to send message to clan chat. Please try again later.', ephemeral: true });
        console.log('Error message sent (ephemeral)');
      }
    }
  },
};
