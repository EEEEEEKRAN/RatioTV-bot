const { Client, GatewayIntentBits } = require('discord.js');
const { token, channelId } = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log('Prêt !');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'random') {
        const channel = client.channels.cache.get(channelId);

        if (channel && channel.type === 0) {
            try {
                const messages = await channel.messages.fetch({ limit: 100 });
                const videoMessages = messages.filter(msg => (
                    (msg.attachments.size > 0 && msg.attachments.first().contentType.startsWith('video')) ||
                    (msg.content.includes('youtube.com') || msg.content.includes('youtu.be'))
                ));

                if (videoMessages.size > 0) {
                    const randomVideoMessage = videoMessages.random();
                    let randomVideoUrl;

                    if (randomVideoMessage.attachments.size > 0) {
                        randomVideoUrl = randomVideoMessage.attachments.first().url;
                    } else {
                        randomVideoUrl = randomVideoMessage.content;
                    }

                    await interaction.reply(`Vidéo aléatoire de RatioTV : ${randomVideoUrl}`);
                } else {
                    await interaction.reply('Aucune vidéo trouvée dans le canal.');
                }
            } catch (error) {
                console.error(error);
                await interaction.reply('Impossible de récupérer les vidéos du canal.');
            }
        } else {
            await interaction.reply('Canal non trouvé ou ce n\'est pas un canal texte.');
        }
    }
});

client.login(token);
