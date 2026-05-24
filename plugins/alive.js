const { cmd } = require('../inconnuboy');
const config = require('../config');
const os = require('os');

//
// ⚡ ULTRA PLUS PING COMMAND
//

cmd({
    pattern: "ping",
    desc: "Check bot latency",
    category: "general",
    react: "⚡"
},
async (conn, mek, m, { from, pushname, reply }) => {

    try {

        const start = Date.now();

        // Loading Message
        const msg = await conn.sendMessage(
            from,
            {
                text: `
╭━━━〔 ⚡ SYSTEM CHECK 〕━━━⬣
┃ 🚀 Testing Server Speed...
┃ 📡 Connecting To Hostify...
╰━━━━━━━━━━━━━━━━━━━━⬣
`
            },
            { quoted: mek }
        );

        const end = Date.now();
        const ping = end - start;

        // Runtime
        const runtime = process.uptime();

        const hours = Math.floor(runtime / 3600);
        const minutes = Math.floor((runtime % 3600) / 60);
        const seconds = Math.floor(runtime % 60);

        // RAM
        const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);

        // Ping Status
        let speed = '🐢 Slow';

        if (ping < 100) speed = '🚀 Super Fast';
        else if (ping < 200) speed = '⚡ Fast';
        else if (ping < 500) speed = '✅ Stable';

        // Final Message
        await conn.sendMessage(
            from,
            {
                text: `
╔═══━━━〔 🏓 PONG RESPONSE 〕━━━═══╗

┃ 👤 USER :
┃ ${pushname || 'User'}

┃ ⚡ SPEED :
┃ ${ping} ms

┃ 🚀 STATUS :
┃ ${speed}

┃ 🕐 RUNTIME :
┃ ${hours}h ${minutes}m ${seconds}s

┃ 💾 RAM USAGE :
┃ ${freeMem}GB / ${totalMem}GB

┃ 🌐 BOT :
┃ HOSTIFY AI MINI

╚═════════════════════════════╝

> 💎 Powered By HOSTIFY
`
            },
            { quoted: msg }
        );

    } catch (e) {

        console.log(e);

        reply(`❌ Error : ${e.message}`);
    }
});


//
// 💫 ULTRA PLUS ALIVE COMMAND
//

cmd({
    pattern: "alive",
    desc: "Check if bot is alive",
    category: "general",
    react: "💫"
},
async (conn, mek, m, { from, pushname, reply }) => {

    try {

        // Runtime
        const runtime = process.uptime();

        const hours = Math.floor(runtime / 3600);
        const minutes = Math.floor((runtime % 3600) / 60);
        const seconds = Math.floor(runtime % 60);

        // Greeting
        const now = new Date();
        const hour = now.getHours();

        let greeting = '🌙 Good Night';

        if (hour >= 5 && hour < 12) greeting = '🌅 Good Morning';
        else if (hour >= 12 && hour < 17) greeting = '☀️ Good Afternoon';
        else if (hour >= 17 && hour < 21) greeting = '🌇 Good Evening';

        await conn.sendMessage(
            from,
            {
                image: { url: config.IMAGE_PATH },

                caption: `
╔═══━━━〔 🤖 HOSTIFY AI MINI 〕━━━═══╗

┃ ${greeting}
┃ 👤 USER : ${pushname || 'User'}
┃
┃ ✅ STATUS : ONLINE
┃ ⚡ SYSTEM : ACTIVE
┃ 🚀 SPEED : STABLE
┃ 🕐 RUNTIME : ${hours}h ${minutes}m ${seconds}s
┃ 🌐 MODE : ${config.WORK_TYPE || 'public'}
┃
┃ 💎 VERSION : 6.0 ULTRA
┃ 🔥 ENGINE : HOSTIFY CORE

╚════════════════════════════════╝

╭━━━〔 ❤️ THANK YOU FOR USING 〕━━━⬣
┃ 🌐 whatsbot.hostify.co.zw
┃ 🚀 FAST • POWERFUL • SMART
╰━━━━━━━━━━━━━━━━━━━━━━━━━━⬣

> ${config.BOT_FOOTER}
`
            },
            { quoted: mek }
        );

    } catch (e) {

        console.log(e);

        reply(`❌ Error : ${e.message}`);
    }
});
