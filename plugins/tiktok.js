const { cmd } = require('../../inconnuboy');

const { post } = require('../../lib/api');

const {
    loading,
    error
} = require('../../lib/style');

cmd({
    pattern: 'tiktok',
    alias: ['tt'],
    desc: 'Download TikTok videos',
    category: 'downloader',
    react: '🎵'
},
async (conn, mek, m, {
    from,
    q,
    reply
}) => {

    try {

        if (!q) {
            return reply('❌ Give TikTok URL');
        }

        await reply(
            loading('Downloading TikTok...')
        );

        const data = await post(
            '/api/downloader/tiktok',
            {
                url: q
            }
        );

        if (!data || data.status === false) {
            return reply(
                error('Failed To Download')
            );
        }

        const video =
            data.result?.video ||
            data.video ||
            data.url;

        if (!video) {
            return reply(
                error('Video Not Found')
            );
        }

        await conn.sendMessage(
            from,
            {
                video: {
                    url: video
                },

                caption: `
╔═══〔 🎵 TIKTOK DOWNLOADER 〕═══╗
┃ ✅ Download Successful
╚══════════════════════════════╝
`
            },
            { quoted: mek }
        );

    } catch (e) {

        console.log(e);

        reply(error(e.message));
    }
});
