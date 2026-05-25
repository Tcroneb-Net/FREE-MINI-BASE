const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
    pattern: "video",
    alias: ["ytv", "ytmp4", "vd"],
    desc: "Download high-quality video from YouTube (Search or Link)",
    category: "download",
    react: "🎥",
    filename: __filename
}, async (conn, m, mek, { from, args, reply }) => {
    try {
        // 1. Input Validation
        if (!args[0]) {
            return reply(
                `*❌ Invalid Usage*\n\n` +
                `Please provide a YouTube link or video name.\n\n` +
                `*Example 1 (Link):*\n.video https://youtu.be/xyz\n\n` +
                `*Example 2 (Search):*\n.video Naruto AMV`
            );
        }

        const query = args.join(" ");
        let videoUrl = query;

        // 2. React to show activity
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // 3. Search if not a direct link
        if (!query.includes("youtube.com") && !query.includes("youtu.be")) {
            await reply(`*🔍 Searching for:* "${query}"...`);
            
            try {
                const searchApi = `https://api.yupra.my.id/api/search/youtube?q=${encodeURIComponent(query)}`;
                const { data: searchData } = await axios.get(searchApi);

                if (!searchData.status || !searchData.results || searchData.results.length === 0) {
                    return reply(`*❌ No results found for:* "${query}"`);
                }

                // Get the first result's URL
                videoUrl = searchData.results[0].url;
            } catch (searchErr) {
                console.error("Search Error:", searchErr);
                return reply("*⚠️ Search API failed. Please try a direct link.*");
            }
        }

        // 4. Fetch Download Info
        await conn.sendMessage(from, { react: { text: "📥", key: mek.key } });        
        const downloadApi = `https://jawad-tech.vercel.app/download/ytdl?url=${encodeURIComponent(videoUrl)}`;
        const { data } = await axios.get(downloadApi);

        if (!data.status || !data.result || !data.result.mp4) {
            return reply("*❌ Failed to process video. The link might be invalid or restricted.*");
        }

        const title = data.result.title || "Unknown Video";
        const thumb = data.result.thumbnail || "";
        const duration = data.result.duration || "N/A";
        const videoBufferUrl = data.result.mp4;

        // 5. Send Info Card with Diamond Style
        const infoCaption = 
            `◇----< *VIDEO INFO* >----◇\n` +
            `|\n` +
            `| *Title:* ${title}\n` +
            `| *Duration:* ${duration}\n` +
            `|\n` +
            `◇-----------------------◇\n\n` +
            `_Sending video now..._ 📤`;

        await conn.sendMessage(from, {
            image: { url: thumb },
            caption: infoCaption
        }, { quoted: mek });

        // 6. Send the Video with Diamond Style
        const finalCaption = 
            `◇----< *DOWNLOAD COMPLETE* >----◇\n` +
            `|\n` +
            `| *Title:* ${title}\n` +
            `|\n` +
            `◇---------------------------◇\n\n` +
            `> Powered by HOSTIFY AI MINI 🚀`;

        await conn.sendMessage(from, {
            video: { url: videoBufferUrl },
            mimetype: "video/mp4",
            caption: finalCaption
        }, { quoted: mek });

        // Final React
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (err) {
        console.error("Video Cmd Error:", err);
        reply("*⚠️ An unexpected error occurred. Please try again later.*");
    }});
