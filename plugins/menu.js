const { cmd, commands } = require('../inconnuboy');
const { getUserConfigFromMongoDB } = require('../lib/database');
const config = require('../config');
const os = require('os');

cmd({
    pattern: 'menu',
    alias: ['help', 'cmds', 'commands'],
    desc: 'Ultra stylish command menu',
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

        // Emojis
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

        // Total Commands
        const totalCommands = commands.filter(c => !c.dontAddCommandList).length;

        // Date
        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();

        let menu = `
╔═━━❮*HOSTIFY AI MINI*❯━═╗
    *◇ FREE WHATSBOT ◇*
╚═══━━━─── • ───━━━═══╝

┏━━━━━━━━━━━━━━━━━━⬣
┃ 👤 User : ${m.pushName || 'User'}
┃ ⚡ Prefix : ${config.PREFIX}
┃ 🌐 Mode : ${config.WORK_TYPE || 'public'}
┃ 📦 Commands : ${totalCommands}
┃ 🕐 Runtime : ${hours}h ${minutes}m ${seconds}s
┃ 💾 RAM : ${freeMem}GB / ${totalMem}GB
┃ 📅 Date : ${date}
┃ ⏰ Time : ${time}
┗━━━━━━━━━━━━━━━━━━⬣

╔═══━━━〔 ⚙️ SETTINGS 〕━━━═══╗
┃ 👁️ Auto View : ${userConfig.AUTO_VIEW_STATUS === 'true' ? 'ON ✅' : 'OFF ❌'}
┃ 📵 Anti Call : ${userConfig.ANTI_CALL === 'true' ? 'ON ✅' : 'OFF ❌'}
┃ 🎙️ Auto Record : ${userConfig.AUTO_RECORDING === 'true' ? 'ON ✅' : 'OFF ❌'}
┃ ⌨️ Auto Typing : ${userConfig.AUTO_TYPING === 'true' ? 'ON ✅' : 'OFF ❌'}
┃ ✅ Auto Read : ${userConfig.READ_MESSAGE === 'true' ? 'ON ✅' : 'OFF ❌'}
╚══════════════════════╝
`;

        // Order
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

╭━━━〔 ${emoji} ${cat.toUpperCase()} 〕━━━⬣
`;

            let count = 1;

            for (const c of categories[cat]) {

                menu += `┃ ${String(count).padStart(2, '0')} ✦ ${config.PREFIX}${c.pattern}\n`;

                count++;
            }

            menu += `╰━━━━━━━━━━━━━━━━━━⬣
`;
        }

        menu += `

╔═══━━━─── • ───━━━═══╗
 💎 whatsbot.hostify.co.zw 
╚═══━━━─── • ───━━━═══╝

> © 2026 FREE WHATSBOT
`;

        await conn.sendMessage(
            from,
            {
                image: { url: config.IMAGE_PATH },
                caption: menu
            },
            { quoted: mek }
        );

    } catch (e) {

        reply(`❌ Menu Error : ${e.message}`);
    }
});
