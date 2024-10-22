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
    await interaction.deferReply();

    const message = interaction.options.getString('message');
    const username = interaction.user.username;
    const formattedMessage = `${username}: ${message}`;
    const CLAN_ID = process.env.CLAN_ID;
    const API_URL = `${process.env.API_URL}clans/${CLAN_ID}/chat`;
    const API_KEY = process.env.API_KEY;

    try {
      const { default: fetch } = await import('node-fetch');

      const body = JSON.stringify({ message: formattedMessage });

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bot ${API_KEY}`,
        },
        body
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      await interaction.editReply({ content: 'Message sent to clan chat!' });
    } catch (error) {
      console.error('Error sending message to Wolvesville chat:', error);
      await interaction.editReply({ content: 'Failed to send message to clan chat. Please try again later.' });
    }
  },
};
