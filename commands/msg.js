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
      // Dynamically import node-fetch
      const fetch = await import('node-fetch').then(module => module.default);

      // Retrieve the message input from the interaction
      const userMessage = interaction.options.getString('message');
      const username = interaction.user.username; // Get the username of the command executor

      // Format the message
      const formattedMessage = `${username}: ${userMessage}`;

      const response = await fetch(`https://api.wolvesville.com/clans/${process.env.CLAN_ID}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bot ${process.env.API_KEY}`, // Use 'Bearer' instead of 'Bot'
        },
        body: JSON.stringify({ message: formattedMessage }), // Send the formatted message
      });

      if (response.ok) {
        await interaction.reply({ content: 'Message sent successfully!', ephemeral: true });
      } else {
        const errorData = await response.json();
        await interaction.reply({ content: `Failed to send message: ${errorData.message}`, ephemeral: true });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while sending the message.', ephemeral: true });
    }
  }
};
