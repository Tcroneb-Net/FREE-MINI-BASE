const { cmd } = require('../inconnuboy');

const {
    downloader
} = require('../lib/fetch');

//
// 🎵 TIKTOK DOWNLOADER
//

cmd({
    pattern: 'tiktok',
    alias: ['tt', 'ttdl', 'tikdl'],
    desc: 'Download TikTok videos',
    category: 'downloader',
    react: '🎵'
},
async (conn, mek, m, {
    from,
    q,
    reply,
    pushname
}) => {

    try {

        //
        // CHECK URL
        //

        if (!q) {

            return reply(`
╔═══〔 🎵 TIKTOK DOWNLOADER 〕═══╗
┃ ❌ Please Provide TikTok URL
┃
┃ Example:
┃ .tiktok https://vt.tiktok.com/...
╚══════════════════════════════╝
`);
        }

        //
        // LOADING MESSAGE
        //

        await conn.sendMessage(from, {
            react: {
                text: '⏳',
                key: mek.key
            }
        });

        const loading = await conn.sendMessage(
            from,
            {
                text: `
╔═══〔 ⏳ DOWNLOADING 〕═══╗
┃ 🎵 Processing TikTok Video
┃ 🚀 Please Wait...
╚════════════════════════╝
`
            },
            { quoted: mek }
        );

        //
        // API REQUEST
        //

        const data = await downloader(
            '/api/downloader/tiktok',
            q
        );

        //
        // ERROR
        //

        if (!data.status) {

            return reply(`
╔═══〔 ❌ API ERROR 〕═══╗
┃ ${data.error}
╚══════════════════════╝
`);
        }

        //
        // RESULT
        //

        const result =
            data.result.result ||
            data.result;

        //
        // VIDEO URL
        //

        const video =
            result.video ||
            result.nowm ||
            result.no_watermark ||
            result.url;

        //
        // AUDIO URL
        //

        const audio =
            result.audio ||
            result.music ||
            result.mp3;

        //
        // META
        //

        const title =
            result.title ||
            'TikTok Video';

        const author =
            result.author ||
            result.nickname ||
            'Unknown';

        //
        // NO VIDEO
        //

        if (!video) {

            return reply(`
╔═══〔 ❌ DOWNLOAD FAILED 〕═══╗
┃ Unable To Download Video
╚════════════════════════════╝
`);
        }

        //
        // SEND VIDEO
        //

        await conn.sendMessage(
            from,
            {
                video: {
                    url: video
                },

                mimetype: 'video/mp4',

                caption: `
╔═══〔 🎵 TIKTOK DOWNLOADER 〕═══╗

┃ 👤 User : ${pushname || 'User'}
┃ 🎬 Title : ${title}
┃ 👑 Author : ${author}
┃ ✅ Status : Success

╚══════════════════════════════╝

> POWERED BY HOSTIFY AI MINI
`,

                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,

                    forwardedNewsletterMessageInfo: {
                        newsletterJid:
                            '120363406434037642@newsletter',

                        newsletterName:
                            'HOSTIFY AI MINI',

                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

        //
        // SEND AUDIO
        //

        if (audio) {

            await conn.sendMessage(
                from,
                {
                    audio: {
                        url: audio
                    },

                    mimetype: 'audio/mpeg',

                    ptt: false
                },
                { quoted: mek }
            );
        }

        //
        // SUCCESS REACTION
        //

        await conn.sendMessage(from, {
            react: {
                text: '✅',
                key: mek.key
            }
        });

    } catch (e) {

        console.log('TIKTOK ERROR:', e);

        reply(`
╔═══〔 ❌ TIKTOK ERROR 〕═══╗
┃ ${e.message}
╚══════════════════════════╝
`);
    }
});

//
// 🔥 AUTO TIKTOK DETECT
//

cmd({
    on: 'body'
},
async (conn, mek, m, {
    body,
    from
}) => {

    try {

        //
        // DETECT TIKTOK URL
        //

        const isTikTok =
            body.includes('tiktok.com/') ||
            body.includes('vt.tiktok.com/');

        if (!isTikTok) return;

        //
        // AUTO REACT
        //

        await conn.sendMessage(from, {
            react: {
                text: '🎵',
                key: mek.key
            }
        });

    } catch (e) {

        console.log(e);
    }
});
