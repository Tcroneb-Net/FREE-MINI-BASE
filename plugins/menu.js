const { cmd, commands } = require('../inconnuboy');
const { getUserConfigFromMongoDB } = require('../lib/database');
const config = require('../config');
const os = require('os');

cmd({
    pattern: 'menu',
    alias: ['help', 'cmds', 'commands'],
    desc: 'Show all commands',
    category: 'general',
    react: '📋'
}, async (conn, mek, m, { from, sender, reply }) => {

    try {

        const number = sender.split('@')[0];

        // Safe config load
        const userConfig = await getUserConfigFromMongoDB(number) || {};

        // Categories
        const categories = {};

        for (const command of commands) {

            if (command.dontAddCommandList) continue;

            const cat = (command.category || 'misc').toLowerCase();

            if (!categories[cat]) {
                categories[cat] = [];
            }

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

        // Memory
        const used = (
            (os.totalmem() - os.freemem()) /
            1024 / 1024 / 1024
        ).toFixed(2);

        const total = (
            os.totalmem() /
            1024 / 1024 / 1024
        ).toFixed(2);

        // Total commands
        const totalCommands = commands.filter(
            c => !c.dontAddCommandList
        ).length;

        // Time
        const now = new Date();

        // Menu text
        let menu = `
╔═══〔 🤖 HOSTIFY AI MINI 〕═══╗
┃ 👤 User : ${m.pushName || 'User'}
┃ ⚡ Prefix : ${config.PREFIX || '.'}
┃ 🌐 Mode : ${config.WORK_TYPE || 'public'}
┃ 📦 Commands : ${totalCommands}
┃ 🕐 Runtime : ${hours}h ${minutes}m ${seconds}s
┃ 💾 RAM : ${used}GB / ${total}GB
┃ 📅 Date : ${now.toLocaleDateString()}
┃ ⏰ Time : ${now.toLocaleTimeString()}
╚════════════════════════╝

╔═══〔 ⚙️ SETTINGS 〕═══╗
┃ 👁️ Auto View : ${userConfig.AUTO_VIEW_STATUS === 'true' ? 'ON ✅' : 'OFF ❌'}
┃ 📵 Anti Call : ${userConfig.ANTI_CALL === 'true' ? 'ON ✅' : 'OFF ❌'}
┃ 🎙️ Auto Record : ${userConfig.AUTO_RECORDING === 'true' ? 'ON ✅' : 'OFF ❌'}
┃ ⌨️ Auto Typing : ${userConfig.AUTO_TYPING === 'true' ? 'ON ✅' : 'OFF ❌'}
┃ ✅ Auto Read : ${userConfig.READ_MESSAGE === 'true' ? 'ON ✅' : 'OFF ❌'}
┃ 💎 Auto VV : ${userConfig.AUTO_VIEWONCE_SAVE === 'true' ? 'ON ✅' : 'OFF ❌'}
╚════════════════════════╝
`;

        // Order
        const order = [
            'general',
            'group',
            'settings',
            'owner',
            'tools',
            'fun',
            'media',
            'misc'
        ];

        const sorted = [
            ...order.filter(c => categories[c]),
            ...Object.keys(categories).filter(c => !order.includes(c))
        ];

        // Add commands
        for (const cat of sorted) {

            if (!categories[cat]) continue;

            const emoji = categoryEmojis[cat] || '📦';

            menu += `

╭━━━〔 ${emoji} ${cat.toUpperCase()} 〕━━━⬣
`;

            let count = 1;

            for (const c of categories[cat]) {

                menu += `┃ ${count}. ${config.PREFIX || '.'}${c.pattern}\n`;

                count++;
            }

            menu += `╰━━━━━━━━━━━━━━━━━━⬣
`;
        }

        menu += `
╔═══〔 💎 HOSTIFY 〕═══╗
┃ 🌐 whatsbot.hostify.co.zw
┃ 🚀 FAST • STABLE • POWERFUL
╚══════════════════════╝
`;

        // SEND
        await conn.sendMessage(
            from,
            {
                image: { url: config.IMAGE_PATH },
                caption: menu
            },
            { quoted: mek }
        );

    } catch (e) {

        console.log(e);

        reply(
            `❌ MENU ERROR\n\n${e.message}`
        );
    }
});
