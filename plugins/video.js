const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
    pattern: "video",
    desc: "Download video from YouTube by name or link",
    category: "main",
    react: "♥️",
    filename: __filename
}, async (conn, m, mek, { from, args, reply }) => {
    try {
        if (!args[0]) {
            return reply("*AP NE KOI YOUTUBE VIDEO DOWNLOAD KARNI HAI 🤔*\n*TO AP ESE LIKHO 😊*\n\n*.VIDEO ❮VIDEO NAME❯* \n\n*JAB AP ESE LIKHO GE 🤗 TO APKI YOUTUBE VIDEO DOWNLOAD KAR KE 😃 YAHA PER BHEJ DE JAYE GE 😍♥️*");
        }

        const query = args.join(" ");
        const start = Date.now();

        await conn.sendMessage(from, { react: { text: "🤗", key: mek.key } });

        let videoUrl = query;

        // If it's NOT a YouTube link, search first using Yupra search
        if (!query.includes("youtube.com") && !query.includes("youtu.be")) {
            const searchUrl = `https://api.yupra.my.id/api/search/youtube?q=${encodeURIComponent(query)}`;
            const searchRes = await axios.get(searchUrl);

            if (!searchRes.data.status || !searchRes.data.results || searchRes.data.results.length === 0) {
                return reply("*APKI YOUTUBE VIDEO NAHI MILI 😔*");
            }

            // Take first result
            videoUrl = searchRes.data.results[0].url;
        }

        // Now download using Jawad-Tech YTDL API
        const apiUrl = `https://jawad-tech.vercel.app/download/ytdl?url=${encodeURIComponent(videoUrl)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.result || !data.result.mp4) {
            return reply("*APKI YOUTUBE VIDEO NAHI MILI 😔*.");
        }

        const title = data.result.title || "BILAL-MD YOUTUBE";
        const videoDownloadUrl = data.result.mp4;

        const end = Date.now();
        const speed = end - start;

        await reply(
            `*👑 YT VIDEO INFO 👑*\n\n` +
            `*👑 VIDEO NAME 👑* \n${title}\n\n` +
            `*DOWNLOADING.....*\n\n` +
            `*👑 BY :❯ BILAL-MD 👑*`
        );

        await conn.sendMessage(from, {
            video: { url: videoDownloadUrl },
            mimetype: "video/mp4",
            caption: title
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply("APKI VIDEO NAHI MIL RAHI 😔*");
    }
});
