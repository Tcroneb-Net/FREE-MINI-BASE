const { cmd } = require('../inconnuboy');
const config = require('../config');
const os = require('os');

cmd({
    pattern: "alive",
    alias: ['online', 'bot'],
    desc: "Check if bot is alive",
    category: "general",
    react: "💫"
},
async (conn, mek, m, {
    from,
    pushname,
    reply
}) => {

    try {

        // Runtime
        const runtime = process.uptime();

        const hours = Math.floor(runtime / 3600);
        const minutes = Math.floor((runtime % 3600) / 60);
        const seconds = Math.floor(runtime % 60);

        // RAM
        const usedRam = (
            (os.totalmem() - os.freemem()) /
            1024 / 1024 / 1024
        ).toFixed(2);

        const totalRam = (
            os.totalmem() /
            1024 / 1024 / 1024
        ).toFixed(2);

        // Time Greeting
        const now = new Date();
        const hour = now.getHours();

        let greeting = '🌙 Good Night';

        if (hour >= 5 && hour < 12) {
            greeting = '🌅 Good Morning';
        } else if (hour >= 12 && hour < 17) {
            greeting = '☀️ Good Afternoon';
        } else if (hour >= 17 && hour < 21) {
            greeting = '🌆 Good Evening';
        }

        // Ping
        const start = Date.now();
        const end = Date.now();
        const speed = end - start;

        // Caption
        const caption = `
╔══〔 🤖 HOSTIFY AI MINI 〕═╗

┃ ${greeting}
◇
┃ 👤 USER : ${pushname || 'User'}
◇
┃ ✅ STATUS : ONLINE
◇
┃ ⚡ SPEED : ${speed}ms
◇
┃ 🚀 SYSTEM : STABLE
┃
┃ 🕐 RUNTIME :
┃ ${hours}h ${minutes}m ${seconds}s
◇
┃ 💾 RAM USAGE :
┃ ${usedRam}GB / ${totalRam}GB
◇
┃ 🌐 MODE :
┃ ${config.WORK_TYPE || 'public'}
◇
┃ 💎 VERSION :
┃ ULTRA PLUS 7.0

╚═══════════════════════╝

╭━━━〔 *❤️ HOSTIFY SYSTEM* 〕━━━⬣
┃ 🌐 whatsbot.hostify.co.zw
┃ 🚀 FAST • SAFE • POWERFUL
┃ 💫 BOT ACTIVE AND RUNNING
╰━━━━━━━━━━━━━━━━━━━━━━⬣

> ${config.BOT_FOOTER || 'Powered By HOSTIFY'}
`;

        // Send safely
        if (config.IMAGE_PATH) {

            await conn.sendMessage(
                from,
                {
                    image: { url: config.IMAGE_PATH },
                    caption: caption
                },
                { quoted: mek }
            );

        } else {

            await conn.sendMessage(
                from,
                {
                    text: caption
                },
                { quoted: mek }
            );
        }

    } catch (e) {

        console.log('Alive Error:', e);

        reply(
            `❌ ALIVE ERROR\n\n${e.message}`
        );
    }
});
