const { cmd } = require('../inconnuboy');
const yts = require('yt-search');
const fetch = require('node-fetch');

// Newsletter context
const newsletterContext = {
    mentionedJid: [],
    forwardingScore: 1000,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363422794491778@newsletter',
        newsletterName: "𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 𝐕2",
        serverMessageId: 143,
    }
};

// ===================== /play Command =====================
cmd({
    pattern: "play",
    alias: ['ytsong', 'song'],
    react: "🎵",
    desc: "Download audio from YouTube",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, sender }) => {
    if (!q) return reply("*❌ Please provide a song title or YouTube URL*");

    try {
        const search = await yts(q);
        const video = search.videos[0];
        if (!video) return reply("*❌ No results found*");

        const messageContext = { ...newsletterContext, mentionedJid: [sender] };

        const infoMsg = `
╔═━「 🎧 𝙈𝙋𝟛 𝘿𝙇 」━═╗

⫸ 🎵 *Title:* ${video.title}
⫸ 👤 *Channel:* ${video.author.name}
⫸ 📅 *Upload Date:* ${video.ago}
⫸ ⏱️ *Duration:* ${video.timestamp}
⫸ 👁️ *Views:* ${video.views.toLocaleString()}
⫸ 🔗 *Link:* ${video.url}
⫸ 📝 *Description:* ${video.description ? video.description.slice(0, 200) + '...' : 'N/A'}

╚═━「 𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 V2 」━═╝`.trim();

        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: infoMsg,
            contextInfo: messageContext
        }, { quoted: mek });

        // Use David Cyril Tech API
        const api = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(video.url)}&apikey=`;
        const res = await fetch(api);
        const json = await res.json();

        if (!json.success || !json.result?.download_url) {
            return reply("*❌ Failed to get audio download link*");
        }

        const title = json.result.title;
        const downloadUrl = json.result.download_url;

        // Send audio
        await conn.sendMessage(from, {
            audio: { url: downloadUrl },
            mimetype: 'audio/mp4',
            fileName: `${title}.mp3`,
            ptt: false,
            contextInfo: messageContext
        }, { quoted: mek });

        // Send as document
        await conn.sendMessage(from, {
            document: { url: downloadUrl },
            mimetype: 'audio/mp4',
            fileName: `${title}.mp3`,
            caption: "*📁 HANS BYTE V2*",
            contextInfo: messageContext
        }, { quoted: mek });

    } catch (err) {
        console.error("Audio Error:", err);
        return reply(`*❌ Error:* ${err.message}`);
    }
});

// ===================== /ytmp3 Command =====================
cmd({
    pattern: "ytmp3",
    alias: ['yturlmp3'],
    react: "🎧",
    desc: "Download audio from YouTube URL",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, sender }) => {
    if (!q || !q.includes("youtube.com/watch?v=")) {
        return reply("*❌ Please provide a valid YouTube video URL*");
    }

    try {
        const api = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(q)}&apikey=`;
        const res = await fetch(api);
        const data = await res.json();

        if (!data.success || !data.result?.download_url) {
            return reply("*❌ Failed to get audio download link*");
        }

        const messageContext = { ...newsletterContext, mentionedJid: [sender] };
        const title = data.result.title;

        const infoMsg = `
╔═━「 🎧 𝙔𝙏𝙈𝙋3 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿 」━═╗

⫸ 📌 *Title:* ${title}
⫸ 📁 *Format:* MP3
⫸ 🕒 *Duration:* ${data.result.duration || 'N/A'}s
⫸ 📝 *Description:* N/A
⫸ 🔗 *Link:* ${q}

╚═━「 𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 V2 」━═╝
`.trim();

        await conn.sendMessage(from, {
            image: { url: data.result.thumbnail },
            caption: infoMsg,
            contextInfo: messageContext
        }, { quoted: mek });

        await conn.sendMessage(from, {
            audio: { url: data.result.download_url },
            mimetype: 'audio/mp4',
            fileName: `${title}.mp3`,
            ptt: false,
            contextInfo: messageContext
        }, { quoted: mek });

        await conn.sendMessage(from, {
            document: { url: data.result.download_url },
            mimetype: 'audio/mp4',
            fileName: `${title}.mp3`,
            caption: "*📁 HANS BYTE V2*",
            contextInfo: messageContext
        }, { quoted: mek });

    } catch (err) {
        console.error("YTMP3 Error:", err);
        return reply(`*❌ Error:* ${err.message}`);
    }
});


// ===================== /yts Command =====================
cmd({
    pattern: "yts",
    alias: ['ytsearch'],
    react: "🎧",
    desc: "Search YouTube for a video",
    category: "search",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, sender }) => {
    if (!q) return reply("*❌ Please provide a song title or keywords for search*");

    try {
        const search = await yts(q);
        const video = search.videos[0];
        if (!video) return reply("*❌ No results found*");

        const messageContext = { ...newsletterContext, mentionedJid: [sender] };

        const infoMsg = `
╔═━「 🔍 𝙔𝙏 𝙎𝙀𝘼𝙍𝘾𝙃 」━═╗

⫸ 📌 *Title:* ${video.title}
⫸ 👤 *Channel:* ${video.author.name}
⫸ 📅 *Upload Date:* ${video.ago}
⫸ ⏱️ *Duration:* ${video.timestamp}
⫸ 👁️ *Views:* ${video.views.toLocaleString()}
⫸ 🔗 *Link:* ${video.url}
⫸ 📝 *Description:* ${video.description ? video.description.slice(0, 200) + '...' : 'N/A'}

╚═━「 𝐇𝐀𝐍𝐒 𝐁𝐘𝐓𝐄 V2 」━═╝
`.trim();

        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: infoMsg,
            contextInfo: messageContext
        }, { quoted: mek });

    } catch (err) {
        console.error("YTB Search Error:", err);
        return reply(`*❌ Error:* ${err.message}`);
    }
});
