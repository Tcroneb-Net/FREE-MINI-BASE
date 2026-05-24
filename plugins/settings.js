const { cmd } = require('../inconnuboy');

const {
    getUserConfigFromMongoDB,
    updateUserConfigInMongoDB
} = require('../lib/database');

//
// ⚡ ULTRA SETTINGS SYSTEM
//

async function toggleSetting(
    number,
    key,
    action,
    reply,
    title,
    enableMsg,
    disableMsg
) {

    const userConfig = await getUserConfigFromMongoDB(number);

    const current = userConfig[key] === 'true';

    // Show Status
    if (!action || !['on', 'off'].includes(action)) {

        return reply(`
╭━━━〔 ⚙️ ${title.toUpperCase()} 〕━━━⬣
┃ STATUS : ${current ? 'ON ✅' : 'OFF ❌'}
┃
┃ USAGE :
┃ .${key.toLowerCase()} on
┃ .${key.toLowerCase()} off
╰━━━━━━━━━━━━━━━━━━⬣
`);
    }

    // Save
    const newValue = action === 'on';

    userConfig[key] = String(newValue);

    await updateUserConfigInMongoDB(number, userConfig);

    return reply(newValue ? enableMsg : disableMsg);
}

//
// 👁️ AUTO VIEW STATUS
//

cmd({
    pattern: 'autoviewstatus',
    alias: ['autoview', 'autostatus'],
    desc: 'Auto view WhatsApp statuses',
    category: 'settings',
    react: '👁️'
},
async (conn, mek, m, { sender, args, reply, isOwner }) => {

    if (!isOwner) {
        return reply('*❌ OWNER ONLY COMMAND*');
    }

    const number = sender.split('@')[0];

    await toggleSetting(
        number,
        'AUTO_VIEW_STATUS',
        args[0],
        reply,
        'Auto View Status',

        `
╔═══〔 👁️ AUTO VIEW STATUS 〕═══╗
┃ ✅ STATUS : ENABLED
┃ 🚀 Bot Will Auto View Status
╚════════════════════════════╝
`,

        `
╔═══〔 👁️ AUTO VIEW STATUS 〕═══╗
┃ ❌ STATUS : DISABLED
╚════════════════════════════╝
`
    );
});

//
// 📵 ANTI CALL
//

cmd({
    pattern: 'anticall',
    alias: ['blockcall'],
    desc: 'Auto reject incoming calls',
    category: 'settings',
    react: '📵'
},
async (conn, mek, m, { sender, args, reply, isOwner }) => {

    if (!isOwner) {
        return reply('*❌ OWNER ONLY COMMAND*');
    }

    const number = sender.split('@')[0];

    await toggleSetting(
        number,
        'ANTI_CALL',
        args[0],
        reply,
        'Anti Call',

        `
╔═══〔 📵 ANTI CALL 〕═══╗
┃ ✅ ENABLED
┃ ☎️ Incoming Calls Will Be Rejected
╚══════════════════════╝
`,

        `
╔═══〔 📵 ANTI CALL 〕═══╗
┃ ❌ DISABLED
╚══════════════════════╝
`
    );
});

//
// 🎙️ AUTO RECORDING
//

cmd({
    pattern: 'autorecording',
    alias: ['autorecord'],
    desc: 'Show recording presence',
    category: 'settings',
    react: '🎙️'
},
async (conn, mek, m, { sender, args, reply, isOwner }) => {

    if (!isOwner) {
        return reply('*❌ OWNER ONLY COMMAND*');
    }

    const number = sender.split('@')[0];

    await toggleSetting(
        number,
        'AUTO_RECORDING',
        args[0],
        reply,
        'Auto Recording',

        `
╔═══〔 🎙️ AUTO RECORDING 〕═══╗
┃ ✅ ENABLED
┃ 🎤 Bot Will Show Recording Status
╚═══════════════════════════╝
`,

        `
╔═══〔 🎙️ AUTO RECORDING 〕═══╗
┃ ❌ DISABLED
╚═══════════════════════════╝
`
    );
});

//
// ⌨️ AUTO TYPING
//

cmd({
    pattern: 'autotyping',
    alias: ['autotype'],
    desc: 'Show typing presence',
    category: 'settings',
    react: '⌨️'
},
async (conn, mek, m, { sender, args, reply, isOwner }) => {

    if (!isOwner) {
        return reply('*❌ OWNER ONLY COMMAND*');
    }

    const number = sender.split('@')[0];

    await toggleSetting(
        number,
        'AUTO_TYPING',
        args[0],
        reply,
        'Auto Typing',

        `
╔═══〔 ⌨️ AUTO TYPING 〕═══╗
┃ ✅ ENABLED
┃ 💬 Bot Will Show Typing Status
╚════════════════════════╝
`,

        `
╔═══〔 ⌨️ AUTO TYPING 〕═══╗
┃ ❌ DISABLED
╚════════════════════════╝
`
    );
});

//
// ✅ AUTO READ
//

cmd({
    pattern: 'readmessage',
    alias: ['autoread', 'bluetick'],
    desc: 'Auto read messages',
    category: 'settings',
    react: '✅'
},
async (conn, mek, m, { sender, args, reply, isOwner }) => {

    if (!isOwner) {
        return reply('*❌ OWNER ONLY COMMAND*');
    }

    const number = sender.split('@')[0];

    await toggleSetting(
        number,
        'READ_MESSAGE',
        args[0],
        reply,
        'Auto Read',

        `
╔═══〔 ✅ AUTO READ 〕═══╗
┃ ✅ ENABLED
┃ 📩 Messages Will Be Auto Read
╚══════════════════════╝
`,

        `
╔═══〔 ✅ AUTO READ 〕═══╗
┃ ❌ DISABLED
╚══════════════════════╝
`
    );
});

//
// 💎 AUTO VIEWONCE SAVE
//

cmd({
    pattern: 'autovv',
    alias: ['autoviewonce', 'autosavevv'],
    desc: 'Auto save all ViewOnce messages',
    category: 'settings',
    react: '💎'
},
async (conn, mek, m, { sender, args, reply, isOwner }) => {

    if (!isOwner) {
        return reply('*❌ OWNER ONLY COMMAND*');
    }

    const number = sender.split('@')[0];

    await toggleSetting(
        number,
        'AUTO_VIEWONCE_SAVE',
        args[0],
        reply,
        'Auto ViewOnce Save',

        `
╔═══〔 💎 AUTO VIEWONCE 〕═══╗
┃ ✅ ENABLED
┃ 👁️ All ViewOnce Media
┃ 📥 Will Be Saved To Owner DM
╚══════════════════════════╝
`,

        `
╔═══〔 💎 AUTO VIEWONCE 〕═══╗
┃ ❌ DISABLED
╚══════════════════════════╝
`
    );
});

//
// 👁️ VIEWONCE COMMAND
// Reply To ViewOnce Message
//

cmd({
    pattern: 'vv',
    alias: ['viewonce'],
    desc: 'Reveal ViewOnce Message',
    category: 'tools',
    react: '👁️'
},
async (conn, mek, m, { quoted, reply }) => {

    try {

        if (!quoted) {
            return reply(`
╭━━━〔 👁️ VIEWONCE TOOL 〕━━━⬣
┃ Reply To A ViewOnce Message
┃
┃ Example:
┃ .vv
╰━━━━━━━━━━━━━━━━━━⬣
`);
        }

        const msg = quoted.message;

        // Image
        if (msg?.viewOnceMessage?.message?.imageMessage) {

            const image = msg.viewOnceMessage.message.imageMessage;

            return await conn.sendMessage(
                m.chat,
                {
                    image: { url: image.url },
                    caption: `
╔═══〔 👁️ VIEWONCE OPENED 〕═══╗
┃ 🖼️ Image Successfully Opened
╚════════════════════════════╝
`
                },
                { quoted: mek }
            );
        }

        // Video
        if (msg?.viewOnceMessage?.message?.videoMessage) {

            const video = msg.viewOnceMessage.message.videoMessage;

            return await conn.sendMessage(
                m.chat,
                {
                    video: { url: video.url },
                    caption: `
╔═══〔 👁️ VIEWONCE OPENED 〕═══╗
┃ 🎥 Video Successfully Opened
╚════════════════════════════╝
`
                },
                { quoted: mek }
            );
        }

        reply('*❌ This is not a ViewOnce message.*');

    } catch (e) {

        console.log(e);

        reply(`❌ Error : ${e.message}`);
    }
});
