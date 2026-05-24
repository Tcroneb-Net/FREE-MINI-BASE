const { cmd } = require('../inconnuboy');

const {
    getUserConfigFromMongoDB,
    updateUserConfigInMongoDB
} = require('../lib/database');

const {
    downloadContentFromMessage
} = require('@whiskeysockets/baileys');

//
// ⚡ SAFE TOGGLE SYSTEM
//

async function toggleSetting({
    sender,
    key,
    action,
    reply,
    title,
    enableText,
    disableText
}) {

    try {

        const number = sender.split('@')[0];

        let userConfig =
            await getUserConfigFromMongoDB(number);

        if (!userConfig || typeof userConfig !== 'object') {
            userConfig = {};
        }

        const current =
            userConfig[key] === 'true';

        // STATUS
        if (!action) {

            return reply(`
╔══〔 ⚙️ ${title.toUpperCase()} 〕═╗
┃ STATUS : ${current ? 'ON ✅' : 'OFF ❌'}
┃
┃ USAGE :
┃ .${key.toLowerCase()} on
┃ .${key.toLowerCase()} off
╚════════════════════════╝
`);
        }

        const input = action.toLowerCase();

        if (!['on', 'off'].includes(input)) {

            return reply(`
❌ INVALID OPTION

Example:
.${key.toLowerCase()} on
.${key.toLowerCase()} off
`);
        }

        // SAVE
        const newValue = input === 'on';

        userConfig[key] = String(newValue);

        await updateUserConfigInMongoDB(
            number,
            userConfig
        );

        return reply(
            newValue
                ? enableText
                : disableText
        );

    } catch (e) {

        console.log(e);

        reply(`❌ ERROR\n${e.message}`);
    }
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
async (conn, mek, m, {
    sender,
    args,
    reply,
    isOwner
}) => {

    if (!isOwner) {
        return reply('❌ OWNER ONLY');
    }

    await toggleSetting({
        sender,
        key: 'AUTO_VIEW_STATUS',
        action: args[0],
        reply,
        title: 'Auto View Status',

        enableText: `
╔═══〔 👁️ AUTO VIEW STATUS 〕═══╗
┃ ✅ ENABLED
┃ Bot Will Auto View Status
╚═══════════════════════╝
`,

        disableText: `
╔═══〔 👁️ AUTO VIEW STATUS 〕═══╗
┃ ❌ DISABLED
╚═══════════════════════╝
`
    });
});

//
// 😍 AUTO STATUS REACT
//

cmd({
    pattern: 'autoreactstatus',
    alias: ['statusreact', 'autostatusreact'],
    desc: 'Auto react to statuses',
    category: 'settings',
    react: '😍'
},
async (conn, mek, m, {
    sender,
    args,
    reply,
    isOwner
}) => {

    if (!isOwner) {
        return reply('❌ OWNER ONLY');
    }

    await toggleSetting({
        sender,
        key: 'AUTO_STATUS_REACT',
        action: args[0],
        reply,
        title: 'Auto Status React',

        enableText: `
╔═══〔 😍 AUTO STATUS REACT 〕═══╗
┃ ✅ ENABLED
┃ Bot Will React To Statuses
╚════════════════════════╝
`,

        disableText: `
╔═══〔 😍 AUTO STATUS REACT 〕═══╗
┃ ❌ DISABLED
╚════════════════════════╝
`
    });
});

//
// 😀 SET STATUS REACTION EMOJI
//

cmd({
    pattern: 'setstatusemoji',
    alias: ['setreact', 'setemoji'],
    desc: 'Set auto status reaction emoji',
    category: 'settings',
    react: '😀'
},
async (conn, mek, m, {
    sender,
    args,
    reply,
    isOwner
}) => {

    try {

        if (!isOwner) {
            return reply('❌ OWNER ONLY');
        }

        const emoji = args[0];

        if (!emoji) {

            return reply(`
╔═══〔 😀 STATUS EMOJI 〕═══╗
┃ Example:
┃ .setstatusemoji ❤️
╚════════════════════╝
`);
        }

        const number = sender.split('@')[0];

        let userConfig =
            await getUserConfigFromMongoDB(number);

        if (!userConfig || typeof userConfig !== 'object') {
            userConfig = {};
        }

        userConfig.STATUS_REACT_EMOJI = emoji;

        await updateUserConfigInMongoDB(
            number,
            userConfig
        );

        reply(`
╔═══〔 😀 STATUS EMOJI 〕═══╗
┃ ✅ SAVED SUCCESSFULLY
┃ EMOJI : ${emoji}
╚════════════════════╝
`);

    } catch (e) {

        console.log(e);

        reply(`❌ ERROR\n${e.message}`);
    }
});

//
// 📵 ANTI CALL
//

cmd({
    pattern: 'anticall',
    desc: 'Reject incoming calls',
    category: 'settings',
    react: '📵'
},
async (conn, mek, m, {
    sender,
    args,
    reply,
    isOwner
}) => {

    if (!isOwner) {
        return reply('❌ OWNER ONLY');
    }

    await toggleSetting({
        sender,
        key: 'ANTI_CALL',
        action: args[0],
        reply,
        title: 'Anti Call',

        enableText: `
╔═══〔 📵 ANTI CALL 〕═══╗
┃ ✅ ENABLED
╚══════════════════╝
`,

        disableText: `
╔═══〔 📵 ANTI CALL 〕═══╗
┃ ❌ DISABLED
╚══════════════════╝
`
    });
});

//
// 💎 AUTO VIEWONCE SAVE
//

cmd({
    pattern: 'autovv',
    alias: ['autosavevv'],
    desc: 'Auto save ViewOnce',
    category: 'settings',
    react: '💎'
},
async (conn, mek, m, {
    sender,
    args,
    reply,
    isOwner
}) => {

    if (!isOwner) {
        return reply('❌ OWNER ONLY');
    }

    await toggleSetting({
        sender,
        key: 'AUTO_VIEWONCE_SAVE',
        action: args[0],
        reply,
        title: 'Auto ViewOnce',

        enableText: `
╔═══〔 💎 AUTO VIEWONCE 〕═══╗
┃ ✅ ENABLED
┃ Media Will Save To Inbox
╚═════════════════════╝
`,

        disableText: `
╔═══〔 💎 AUTO VIEWONCE 〕═══╗
┃ ❌ DISABLED
╚═════════════════════╝
`
    });
});

//
// 👁️ VIEWONCE COMMAND
//

cmd({
    pattern: 'vv',
    alias: ['viewonce'],
    desc: 'Reveal ViewOnce',
    category: 'tools',
    react: '👁️'
},
async (conn, mek, m, {
    from,
    reply
}) => {

    try {

        const quoted =
            mek.message?.extendedTextMessage
                ?.contextInfo?.quotedMessage;

        if (!quoted) {

            return reply(`
╔═══〔 👁️ VIEWONCE TOOL 〕═══╗
┃ Reply To A ViewOnce Message
┃ Then Type:
┃ .vv
╚═════════════════════╝
`);
        }

        // WRAPPER
        const viewOnce =
            quoted.viewOnceMessageV2 ||
            quoted.viewOnceMessageV2Extension ||
            quoted.viewOnceMessage;

        // MEDIA
        const media =
            viewOnce?.message?.imageMessage ||
            viewOnce?.message?.videoMessage;

        if (!media) {
            return reply('❌ Not A ViewOnce Message');
        }

        const isImage =
            !!viewOnce?.message?.imageMessage;

        const type =
            isImage ? 'image' : 'video';

        // DOWNLOAD
        const stream =
            await downloadContentFromMessage(
                media,
                type
            );

        let buffer = Buffer.from([]);

        for await (const chunk of stream) {
            buffer = Buffer.concat([
                buffer,
                chunk
            ]);
        }

        // SEND
        await conn.sendMessage(
            from,
            {
                [type]: buffer,

                caption:
                    media.caption ||
                    '👁️ ViewOnce Opened'
            },
            { quoted: mek }
        );

    } catch (e) {

        console.log(e);

        reply(`❌ ERROR\n${e.message}`);
    }
});

//
// ⚙️ SETTINGS STATUS
//

cmd({
    pattern: 'settings',
    desc: 'View settings status',
    category: 'settings',
    react: '⚙️'
},
async (conn, mek, m, {
    sender,
    reply,
    isOwner
}) => {

    try {

        if (!isOwner) {
            return reply('❌ OWNER ONLY');
        }

        const number = sender.split('@')[0];

        let userConfig =
            await getUserConfigFromMongoDB(number);

        if (!userConfig || typeof userConfig !== 'object') {
            userConfig = {};
        }

        reply(`
╔═══〔 ⚙️ BOT SETTINGS 〕═══╗

┃ 👁️ Auto View :
┃ ${userConfig.AUTO_VIEW_STATUS === 'true' ? 'ON ✅' : 'OFF ❌'}

┃ 😍 Auto React :
┃ ${userConfig.AUTO_STATUS_REACT === 'true' ? 'ON ✅' : 'OFF ❌'}

┃ 😀 React Emoji :
┃ ${userConfig.STATUS_REACT_EMOJI || '❤️'}

┃ 📵 Anti Call :
┃ ${userConfig.ANTI_CALL === 'true' ? 'ON ✅' : 'OFF ❌'}

┃ 💎 Auto VV :
┃ ${userConfig.AUTO_VIEWONCE_SAVE === 'true' ? 'ON ✅' : 'OFF ❌'}

╚════════════════════╝
`);

    } catch (e) {

        console.log(e);

        reply(`❌ ERROR\n${e.message}`);
    }
});
