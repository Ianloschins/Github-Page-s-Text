const Discord = require('discord.js');
const axios = require('axios');

// Discord API token and webhook URL
const DISCORD_TOKEN = 'MTA4NjA1MTIxNTAzNDU2ODc2NA.G-8V28.9lfiEyqBPmIltwY3O1zEu2f7OTkeyWrBr3oiFE';
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1086058326539894826/nbwt7xvFglVkOyC8tcPID1lAWQwIeDg6w91j8LaC48trbNuE4aBX54NEI5APkWbfNdQ3';

// GitHub API endpoint and authentication
const GITHUB_API = 'https://api.github.com/users/Ianloschins';
const GITHUB_USERNAME = 'Ianloschins';
const GITHUB_TOKEN = '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';

// Discord client and webhook
const client = new Discord.Client();
const webhook = new Discord.WebhookClient({ url: WEBHOOK_URL });

client.on('ready', async () => {
  // Fetch the list of members in the server
  const guild = client.guilds.cache.first();
  const members = await guild.members.fetch();

  // Iterate over the members and fetch their GitHub profile links
  for (const [memberId, member] of members) {
    // Skip members who do not have a GitHub username
    if (!member.presence.activities.some(activity => activity.type === 'CUSTOM_STATUS' && activity.state.startsWith('GitHub: '))) {
      continue;
    }

    // Fetch the user's profile information from the GitHub API
    const githubUsername = member.presence.activities.find(activity => activity.type === 'CUSTOM_STATUS' && activity.state.startsWith('GitHub: ')).state.slice(8);
    const response = await axios.get(`${GITHUB_API}${githubUsername}`, {
      auth: {
        username: GITHUB_USERNAME,
        password: GITHUB_TOKEN,
      },
    });

    // Format the message and send it to the webhook
    if (response.status === 200) {
      const userInfo = response.data;
      const message = `${member.displayName}: ${userInfo.html_url}`;
      webhook.send(message);
    }
  }
});

client.login(DISCORD_TOKEN);
