const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "song",
    alias: ["audio", "mp3", "yta"],
    desc: "Download YouTube audio by name or link",
    category: "download",
    filename: __filename
},
async (conn, mek, m, {
    from,
    args,
    reply
}) => {

    try {

        // ❌ No Query
        if (!args[0]) {
            return reply(
`╭━━━〔 🎵 YOUTUBE AUDIO 🎵 〕━━━╮
┃
┃ 📌 *Example :*
┃ ➤ .song Faded Alan Walker
┃ ➤ .mp3 https://youtu.be/xxxx
┃
┃ ⚡ Download Fast YouTube MP3
┃ 🎧 High Quality Audio
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯

> 👑 POWERED BY BILAL-MD`
            );
        }

        const query = args.join(" ");
        const start = Date.now();

        // 🔥 React
        await conn.sendMessage(from, {
            react: {
                text: "🎵",
                key: mek.key
            }
        });

        let videoUrl = query;

        // 🔍 Search YouTube If Not URL
        if (
            !query.includes("youtube.com") &&
            !query.includes("youtu.be")
        ) {

            const searchUrl =
                `https://api.yupra.my.id/api/search/youtube?q=${encodeURIComponent(query)}`;

            const searchRes = await axios.get(searchUrl);

            if (
                !searchRes.data.status ||
                !searchRes.data.results ||
                searchRes.data.results.length === 0
            ) {
                return reply("❌ *Audio Not Found!*");
            }

            // ✅ First Video
            videoUrl = searchRes.data.results[0].url;
        }

        // 🎵 Get MP3 Download Link
        const apiRes = await axios.post(
            "https://api.hostify.indevs.in/api/downloader/ytmp3",
            {
                url: videoUrl
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        const data = apiRes.data;

        // ❌ Error Check
        if (
            !data.success ||
            !data.result ||
            !data.result.download_url
        ) {
            return reply("❌ *Failed To Download Audio!*");
        }

        const title = data.result.title || "YouTube Audio";
        const audioUrl = data.result.download_url;

        const speed =
            ((Date.now() - start) / 1000).toFixed(2);

        // 📢 Info Message
        await reply(
`╭━━━〔 🎧 YT AUDIO INFO 🎧 〕━━━╮
┃
┃ 🎼 *Title :*
┃ ${title}
┃
┃ ⚡ *Status :* Uploading...
┃ 🚀 *Speed :* ${speed}s
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯

> 👑 FREE WHATSBOT MINI 👑`
        );

        // ✅ Download Audio Buffer
        const audioBuffer = await axios.get(audioUrl, {
            responseType: "arraybuffer"
        });

        // ✅ Send Audio Properly
        await conn.sendMessage(
            from,
            {
                audio: Buffer.from(audioBuffer.data),
                mimetype: "audio/mpeg",
                fileName: `${title}.mp3`,
                ptt: false
            },
            {
                quoted: mek
            }
        );

        // ✅ Success React
        await conn.sendMessage(from, {
            react: {
                text: "✅",
                key: mek.key
            }
        });

    } catch (err) {

        console.error(err);

        reply(
`╭━━━〔 ❌ ERROR ❌ 〕━━━╮
┃
┃ 😔 Failed To Download Audio
┃ 🔄 Please Try Again Later
┃
╰━━━━━━━━━━━━━━━━━━╯`
        );
    }
});
