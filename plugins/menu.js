const { cmd, commands } = require('../inconnuboy');
const { getUserConfigFromMongoDB } = require('../lib/database');
const config = require('../config');
const os = require('os');

cmd({
    pattern: 'menu',
    alias: ['help', 'cmds', 'commands'],
    desc: 'Ultra Plus Stylish Menu',
    category: 'general',
    react: '📋'
}, async (conn, mek, m, { from, sender, reply }) => {

    try {

        const number = sender.split('@')[0];
        const userConfig = await getUserConfigFromMongoDB(number);

        // Group Commands
        const categories = {};

        for (const command of commands) {

            if (command.dontAddCommandList) continue;

            const cat = (command.category || 'misc').toLowerCase();

            if (!categories[cat]) categories[cat] = [];

            categories[cat].push(command);
        }

        // Category Emojis
        const categoryEmojis = {
            general: '🌐',
            group: '👥',
            settings: '⚙️',
            owner: '👑',
            tools: '🛠️',
            fun: '🎭',
            media: '🎬',
            misc: '📦'
        };

        // Runtime
        const runtime = process.uptime();

        const hours = Math.floor(runtime / 3600);
        const minutes = Math.floor((runtime % 3600) / 60);
        const seconds = Math.floor(runtime % 60);

        // RAM
        const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);

        // CPU
        const cpuModel = os.cpus()[0].model;

        // Total Commands
        const totalCommands = commands.filter(c => !c.dontAddCommandList).length;

        // Date & Time
        const now = new Date();

        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();

        // Greeting
        const hour = now.getHours();

        let greeting = '🌙 Good Night';

        if (hour >= 5 && hour < 12) greeting = '🌅 Good Morning';
        else if (hour >= 12 && hour < 17) greeting = '☀️ Good Afternoon';
        else if (hour >= 17 && hour < 21) greeting = '🌇 Good Evening';

        // Menu Start
        let menu = `
*╭━━━ 〔 𝚃𝙲𝚁𝙾𝙽𝙴𝙱 𝚇𝙼𝙳 𝙿𝙻𝚄𝚂〕━━━┈⊷*
*┃➣* *ᴜsᴇʀ* : ${m.pushName || 'User'}
*┃➣* *ʀᴜɴᴛɪᴍᴇ* : ${hours}h ${minutes}m ${seconds}s
*┃➣* *ᴍᴏᴅᴇ* : ${config.WORK_TYPE || 'public'}}
*┃➣* *ᴘʀᴇғɪx* : [ ${config.PREFIX} ]
*┃➣* *ᴩʟᴜɢɪɴ* : ${totalCommands}
*╰━━━━━━━━━━━━━━━━━❍❍➣*

━━━〔 👋 ${greeting} 〕━━━

╔════〔 ⚙️ BOT SETTINGS 〕════╗
┃ 👁️ AUTO VIEW :
┃ ${userConfig.AUTO_VIEW_STATUS === 'true' ? 'ON ✅' : 'OFF ❌'}
┃
┃ 📵 ANTI CALL :
┃ ${userConfig.ANTI_CALL === 'true' ? 'ON ✅' : 'OFF ❌'}
┃
┃ 🎙️ AUTO RECORD :
┃ ${userConfig.AUTO_RECORDING === 'true' ? 'ON ✅' : 'OFF ❌'}
┃
┃ ⌨️ AUTO TYPING :
┃ ${userConfig.AUTO_TYPING === 'true' ? 'ON ✅' : 'OFF ❌'}
┃
┃ ✅ AUTO READ :
┃ ${userConfig.READ_MESSAGE === 'true' ? 'ON ✅' : 'OFF ❌'}
╚══════════════════════════╝
`;

        // Category Order
        const catOrder = [
            'general',
            'group',
            'settings',
            'owner',
            'tools',
            'fun',
            'media',
            'misc'
        ];

        const sortedCats = [
            ...catOrder.filter(c => categories[c]),
            ...Object.keys(categories).filter(c => !catOrder.includes(c))
        ];

        // Categories
        for (const cat of sortedCats) {

            if (!categories[cat]?.length) continue;

            const emoji = categoryEmojis[cat] || '📦';

            menu += `

╭────────❒〔 ${emoji} ${cat.toUpperCase()} 〕 ➣
`;

            let count = 1;

            for (const c of categories[cat]) {

                menu += `│➣│▸ ${String(count).padStart(2, '0')} ✦ ${config.PREFIX}${c.pattern}`;

                if (c.desc) {
                    menu += `\n┃ ➥ ${c.desc}`;
                }

                menu += `\n┃`;
                count++;
            }

            menu += `╰────────❍─────❍❍➣
`;
        }

        // Footer
        menu += `

╭━〔 💎 HOSTIFY OFFICIAL 〕━⬣
┃ 🌐 whatsbot.hostify.co.zw
┃ 🚀 FAST • SMART • POWERFUL
┃ ❤️ THANK YOU FOR USING
╰━━━━━━━━━━━━━━━━━━━━⬣

> © 2026 HOSTIFY AI MINI
`;

        // Send Message
        await conn.sendMessage(
            from,
            {
                image: { url: config.IMAGE_PATH },
                caption: menu
            },
            { quoted: mek }
        );

    } catch (e) {

        reply(`❌ MENU ERROR : ${e.message}`);
    }
});
