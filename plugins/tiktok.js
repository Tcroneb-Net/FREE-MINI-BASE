const { cmd } = require('../inconnuboy');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["tt", "ttdl", "tik"],
    desc: "Download TikTok videos without watermark",
    category: "download",
    react: "🎬",
    filename: __filename
},
async (conn, m, mek, {
    from,
    args,
    reply
}) => {

    try {

        // ❌ No URL
        if (!args[0]) {
            return reply(
`╭───❒〔 🎬 TIKTOK DOWNLOADER 🎬 〕➣
┃
┃ 📌 *Example :*
┃ ➤ .tiktok https://vt.tiktok.com/xxxx
┃
┃ ⚡ Download TikTok Videos
┃ 💎 No Watermark
┃ 🚀 Fast Download Speed
┃
╰────────❍─────❍❍➣

> 👑 POWERED BY WOT TEAM`
            );
        }

        const tiktokUrl = args[0];
        const start = Date.now();

        // 🔥 React
        await conn.sendMessage(from, {
            react: {
                text: "⏳",
                key: mek.key
            }
        });

        // 🌐 API Request
        const apiUrl =
            `https://jawad-tech.vercel.app/download/tiktok?url=${encodeURIComponent(tiktokUrl)}`;

        const { data } = await axios.get(apiUrl);

        // ❌ Invalid Response
        if (!data.status || !data.result) {
            return reply(
`╭━━━〔 ❌ FAILED ❌ 〕➣
┃
┃ 😔 Unable To Download Video
┃ 🔄 Try Another TikTok Link
┃
╰────────❍─────❍❍➣`
            );
        }

        // ✅ Data
        const videoUrl = data.result;
        const meta = data.metadata || {};

        const title =
            meta.title || "TikTok Video";

        const author =
            meta.author || "Unknown";

        const duration =
            meta.duration || "Unknown";

        const speed =
            ((Date.now() - start) / 1000).toFixed(2);

        // 📢 Stylish Caption
        const caption =
`╭─────❒〔 TIKTOK 〕➣
◇
◆ 🎞️ *Title :*
◇  *${title}*

◆ 👤 *Author :* ${author}
◇ ⏱️ *Duration :* ${duration}
◆ ⚡ *Speed :* ${speed}s
◇ 💎 *Quality :* HD
◆ 🚫 *Watermark :* No
╰────────❍─────❍❍➣
> 👑 FREE WHATSBOT MINI 👑`;

        // 🎥 Send Video
        await conn.sendMessage(
            from,
            {
                video: { url: videoUrl },
                mimetype: "video/mp4",
                caption: caption
            },
            { quoted: mek }
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

        // ❌ Error Message
        reply(
`╭────────❒〔 ❌ ERROR ❌ 〕➣
┃
┃ 😔 Error While Downloading
┃ 🔄 Please Try Again Later
┃
╰────────❍─────❍❍➣`
        );
    }
});
