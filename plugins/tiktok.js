const { cmd } = require('../inconnuboy');

const {
    downloader,
    getBuffer
} = require('../lib/fetch');

//
// ╔══════════════════════════════╗
// ║      ULTRA TIKTOK SYSTEM     ║
// ╚══════════════════════════════╝
//

//
// 🔍 EXTRACT DATA SAFELY
//

function extractData(data = {}) {

    const result =
        data?.result?.result ||
        data?.result?.data ||
        data?.result ||
        data?.data ||
        {};

    return {

        //
        // VIDEO
        //

        video:

            result.video ||
            result.play ||
            result.nowm ||
            result.no_watermark ||
            result.video_url ||
            result.download ||
            result.url ||

            null,

        //
        // AUDIO
        //

        audio:

            result.audio ||
            result.music ||
            result.mp3 ||
            result.music_info?.url ||

            null,

        //
        // THUMBNAIL
        //

        image:

            result.cover ||
            result.thumbnail ||
            result.thumb ||
            result.image ||

            null,

        //
        // TITLE
        //

        title:

            result.title ||
            result.caption ||
            result.desc ||

            'TikTok Video',

        //
        // AUTHOR
        //

        author:

            result.author ||
            result.nickname ||
            result.username ||
            result.owner ||

            'Unknown',

        //
        // LIKES
        //

        likes:

            result.like ||
            result.likes ||
            result.like_count ||

            'Unknown',

        //
        // COMMENTS
        //

        comments:

            result.comment ||
            result.comments ||

            'Unknown'
    };
}

//
// 🎵 MAIN TIKTOK COMMAND
//

cmd({
    pattern: 'tiktok',
    alias: [
        'tt',
        'ttdl',
        'tikdl',
        'tiktokdl'
    ],

    desc: 'Download TikTok Videos',

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
┃ .tiktok https://vt.tiktok.com/
╚══════════════════════════════╝
`);
        }

        //
        // REACT
        //

        await conn.sendMessage(from, {
            react: {
                text: '⏳',
                key: mek.key
            }
        });

        //
        // LOADING
        //

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
        // DEBUG
        //

        console.log(
            JSON.stringify(data, null, 2)
        );

        //
        // ERROR
        //

        if (
            data.status === false ||
            data.success === false
        ) {

            return reply(`
╔═══〔 ❌ API ERROR 〕═══╗
┃ ${data.error || 'Request Failed'}
╚══════════════════════╝
`);
        }

        //
        // EXTRACT
        //

        const result = extractData(data);

        //
        // NO VIDEO
        //

        if (!result.video) {

            return reply(`
╔═══〔 ❌ DOWNLOAD FAILED 〕═══╗
┃ Video URL Not Found
╚════════════════════════════╝
`);
        }

        //
        // THUMBNAIL
        //

        if (result.image) {

            await conn.sendMessage(
                from,
                {
                    image: {
                        url: result.image
                    },

                    caption: `
╔═══〔 🎵 TIKTOK PREVIEW 〕═══╗

┃ 👤 USER :
┃ ${pushname || 'User'}

┃ 🎬 TITLE :
┃ ${result.title}

┃ 👑 AUTHOR :
┃ ${result.author}

┃ ❤️ LIKES :
┃ ${result.likes}

┃ 💬 COMMENTS :
┃ ${result.comments}

╚══════════════════════════╝

> HOSTIFY AI MINI
`
                },
                { quoted: mek }
            );
        }

        //
        // SEND VIDEO
        //

        await conn.sendMessage(
            from,
            {
                video: {
                    url: result.video
                },

                mimetype: 'video/mp4',

                caption: `
╔═══〔 🎵 TIKTOK DOWNLOADER 〕═══╗

┃ ✅ DOWNLOAD SUCCESSFUL

┃ 🎬 ${result.title}

┃ 👑 ${result.author}

╚══════════════════════════════╝

> POWERED BY HOSTIFY AI MINI
`,

                gifPlayback: false,

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

        if (result.audio) {

            await conn.sendMessage(
                from,
                {
                    audio: {
                        url: result.audio
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

        console.log(
            'TIKTOK ERROR:',
            e
        );

        reply(`
╔═══〔 ❌ TIKTOK ERROR 〕═══╗
┃ ${e.message}
╚══════════════════════════╝
`);
    }
});

//
// 🖼️ TIKTOK IMAGE DOWNLOADER
//

cmd({
    pattern: 'ttimg',
    alias: [
        'tiktokimg',
        'ttphoto'
    ],

    desc: 'Download TikTok Images',

    category: 'downloader',

    react: '🖼️'
},
async (conn, mek, m, {
    from,
    q,
    reply
}) => {

    try {

        if (!q) {

            return reply(`
╔═══〔 🖼️ TIKTOK IMAGE 〕═══╗
┃ ❌ Please Provide URL
╚══════════════════════════╝
`);
        }

        const data = await downloader(
            '/api/downloader/tiktok',
            q
        );

        const result =
            data?.result?.result ||
            data?.result?.data ||
            data?.result ||
            {};

        //
        // IMAGES
        //

        const images =
            result.images ||
            result.image ||
            result.photos ||
            [];

        //
        // NO IMAGES
        //

        if (!images.length) {

            return reply(`
╔═══〔 ❌ NO IMAGES FOUND 〕═══╗
┃ This TikTok Has No Photos
╚════════════════════════════╝
`);
        }

        //
        // SEND ALL
        //

        for (const img of images) {

            await conn.sendMessage(
                from,
                {
                    image: {
                        url: img
                    }
                },
                { quoted: mek }
            );
        }

    } catch (e) {

        console.log(e);

        reply(`
╔═══〔 ❌ IMAGE ERROR 〕═══╗
┃ ${e.message}
╚════════════════════════╝
`);
    }
});

//
// 🔥 AUTO DETECT TIKTOK LINKS
//

cmd({
    on: 'body'
},
async (conn, mek, m, {
    body,
    from
}) => {

    try {

        const isTikTok =

            body.includes('tiktok.com/') ||
            body.includes('vt.tiktok.com/');

        if (!isTikTok) return;

        //
        // REACT
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
