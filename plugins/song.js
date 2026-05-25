const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
    pattern: "song",
    alias: ["audio", "mp3", "yta"],
    desc: "Download YouTube audio by name or link",
    category: "main",
    filename: __filename
}, async (conn, m, mek, { from, args, reply }) => {

    try {

        if (!args[0]) {
            return reply(
`╭━━━〔 🎵 YT AUDIO DOWNLOADER 🎵 〕━━━╮
┃
┃ 📌 *Example :*
┃ ➤ .song Faded Alan Walker
┃ ➤ .mp3 https://youtu.be/xxxx
┃
┃ ⚡ Download YouTube Audio Fast
┃ 🎧 High Quality MP3
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯

> 👑 whatsbot.hostify.co.zw`
            );
        }

        const query = args.join(" ");
        const start = Date.now();

        // React Emoji
        await conn.sendMessage(from, {
            react: { text: "🎵", key: mek.key }
        });

        let videoUrl = query;

        // 🔍 Search YouTube if not URL
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

            videoUrl = searchRes.data.results[0].url;
        }

        // 🎵 Download MP3 From New API
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

        if (!data.success || !data.result?.download_url) {
            return reply("❌ *Failed To Download Audio!*");
        }

        const title = data.result.title || "YouTube Audio";
        const audioUrl = data.result.download_url;

        const speed = ((Date.now() - start) / 1000).toFixed(2);

        // Stylish Info Message
        await reply(
`╭━━━〔 🎧 YT AUDIO INFO 🎧 〕━━━╮
┃
┃ 🎼 *Title :*
┃ ${title}
┃
┃ ⚡ *Status :* Downloading...
┃ 🚀 *Speed :* ${speed}s
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯

> 👑 FREE WHATSBOT MINI👑`
        );

        // Send Audio
        await conn.sendMessage(
            from,
            {
                audio: { url: audioUrl },
                mimetype: "audio/mpeg",
                fileName: `${title}.mp3`
            },
            { quoted: mek }
        );

        // Success Reaction
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
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
