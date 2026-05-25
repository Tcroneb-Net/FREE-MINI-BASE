const { cmd, commands } = require('../inconnuboy');
const { getUserConfigFromMongoDB } = require('../lib/database');
const config = require('../config');
const os = require('os');

cmd({
    pattern: 'menu',
    alias: ['help', 'cmds', 'commands'],
    desc: 'Clean stylish command menu',
    category: 'general',
    react: '📋'
},
async (conn, mek, m, {
    from,
    sender,
    reply
}) => {

    try {

        //
        // USER
        //

        const number =
            sender.split('@')[0];

        const userConfig =
            await getUserConfigFromMongoDB(number);

        //
        // GROUP COMMANDS
        //

        const categories = {};

        for (const command of commands) {

            if (command.dontAddCommandList)
                continue;

            const cat =
                (command.category || 'misc')
                .toLowerCase();

            if (!categories[cat]) {

                categories[cat] = [];
            }

            categories[cat].push(command);
        }

        //
        // EMOJIS
        //

        const categoryEmojis = {

            general: '🌐',
            group: '👥',
            settings: '⚙️',
            owner: '👑',
            tools: '🛠️',
            downloader: '📥',
            search: '🔎',
            ai: '🤖',
            fun: '🎭',
            media: '🎬',
            misc: '📦'
        };

        //
        // RUNTIME
        //

        const runtime =
            process.uptime();

        const hours =
            Math.floor(runtime / 3600);

        const minutes =
            Math.floor(
                (runtime % 3600) / 60
            );

        const seconds =
            Math.floor(runtime % 60);

        //
        // MEMORY
        //

        const totalMem =
            (
                os.totalmem() /
                1024 /
                1024 /
                1024
            ).toFixed(2);

        const freeMem =
            (
                os.freemem() /
                1024 /
                1024 /
                1024
            ).toFixed(2);

        //
        // TOTAL COMMANDS
        //

        const totalCommands =
            commands.filter(
                cmd =>
                    !cmd.dontAddCommandList
            ).length;

        //
        // SETTINGS
        //

        const autoView =
            userConfig.AUTO_VIEW_STATUS === 'true'
                ? 'ON ✅'
                : 'OFF ❌';

        const antiCall =
            userConfig.ANTI_CALL === 'true'
                ? 'ON ✅'
                : 'OFF ❌';

        const autoRecord =
            userConfig.AUTO_RECORDING === 'true'
                ? 'ON ✅'
                : 'OFF ❌';

        const autoTyping =
            userConfig.AUTO_TYPING === 'true'
                ? 'ON ✅'
                : 'OFF ❌';

        const autoRead =
            userConfig.READ_MESSAGE === 'true'
                ? 'ON ✅'
                : 'OFF ❌';

        //
        // DATE
        //

        const date =
            new Date().toLocaleDateString();

        const time =
            new Date().toLocaleTimeString();

        //
        // HEADER
        //

        let menu = `
╭━━━〔 🤖 HOSTIFY AI MINI 〕━━━⬣
┃ 👤 User : ${m.pushName || 'User'}
┃ ⚡ Prefix : ${config.PREFIX}
┃ 🌐 Mode : ${config.WORK_TYPE || 'public'}
┃ 📦 Commands : ${totalCommands}
┃ 🕒 Runtime : ${hours}h ${minutes}m ${seconds}s
┃ 💾 RAM : ${freeMem}GB / ${totalMem}GB
┃ 📅 Date : ${date}
┃ ⏰ Time : ${time}
╰━━━━━━━━━━━━━━━━━━━━⬣

╭━━━〔 ⚙️ SETTINGS 〕━━━⬣
┃ 👁️ Auto View   : ${autoView}
┃ 📵 Anti Call   : ${antiCall}
┃ 🎙️ Auto Record : ${autoRecord}
┃ ⌨️ Auto Typing : ${autoTyping}
┃ ✅ Auto Read   : ${autoRead}
╰━━━━━━━━━━━━━━━━━━━━⬣
`;

        //
        // CATEGORY ORDER
        //

        const catOrder = [

            'general',
            'group',
            'settings',
            'owner',
            'tools',
            'downloader',
            'search',
            'ai',
            'fun',
            'media',
            'misc'
        ];

        const sortedCats = [

            ...catOrder.filter(
                c => categories[c]
            ),

            ...Object.keys(categories)
            .filter(
                c =>
                    !catOrder.includes(c)
            )
        ];

        //
        // COMMAND LIST
        //

        for (const cat of sortedCats) {

            if (
                !categories[cat] ||
                !categories[cat].length
            ) continue;

            const emoji =
                categoryEmojis[cat] || '📦';

            menu += `

╭━━━〔 ${emoji} ${cat.toUpperCase()} 〕━━━⬣
`;

            let count = 1;

            for (const c of categories[cat]) {

                menu +=
`┃ ${String(count).padStart(2, '0')} │ ${config.PREFIX}${c.pattern}
┃ ➥ ${c.desc || 'No description'}
┃
`;

                count++;
            }

            menu +=
`╰━━━━━━━━━━━━━━━━━━━━⬣
`;
        }

        //
        // FOOTER
        //

        menu += `

╭━━━━━━━━━━━━━━━━━━━━⬣
┃ 💎 HOSTIFY AI MINI
┃ 🌐 whatsbot.hostify.co.zw
┃ 🚀 Fast • Clean • Powerful
╰━━━━━━━━━━━━━━━━━━━━⬣

> © 2026 HOSTIFY AI MINI
`;

        //
        // SEND
        //

        await conn.sendMessage(
            from,
            {
                image: {
                    url: config.IMAGE_PATH
                },

                caption: menu
            },
            { quoted: mek }
        );

    } catch (e) {

        console.log(e);

        reply(`
╭━━━〔 ❌ MENU ERROR 〕━━━⬣
┃ ${e.message}
╰━━━━━━━━━━━━━━━━━━━━⬣
`);
    }
});
