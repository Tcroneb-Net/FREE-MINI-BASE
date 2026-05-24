const { cmd } = require('../inconnuboy');

const {
    getUserConfigFromMongoDB,
    updateUserConfigInMongoDB
} = require('../lib/database');

//
// ⚡ SAFE SETTINGS SYSTEM
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

        // Get Config Safely
        let userConfig = await getUserConfigFromMongoDB(number);

        if (!userConfig || typeof userConfig !== 'object') {
            userConfig = {};
        }

        // Current Status
        const current = userConfig[key] === 'true';

        // Show Status
        if (!action) {

            return reply(`
╔═══〔 ⚙️ ${title.toUpperCase()} 〕═══╗
┃ STATUS : ${current ? 'ON ✅' : 'OFF ❌'}
┃
┃ USAGE :
┃ .${key.toLowerCase()} on
┃ .${key.toLowerCase()} off
╚════════════════════════╝
`);
        }

        // Validate
        const input = action.toLowerCase();

        if (!['on', 'off'].includes(input)) {

            return reply(`
❌ Invalid Option

Example:
.${key.toLowerCase()} on
.${key.toLowerCase()} off
`);
        }

        // Save
        const newValue = input === 'on';

        userConfig[key] = String(newValue);

        await updateUserConfigInMongoDB(
            number,
            userConfig
        );

        return reply(
            newValue ? enableText : disableText
        );

    } catch (e) {

        console.log(e);

        return reply(
            `❌ SETTINGS ERROR\n\n${e.message}`
        );
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
        return reply('❌ Owner Only Command');
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
╚════════════════════════════╝
`,

        disableText: `
╔═══〔 👁️ AUTO VIEW STATUS 〕═══╗
┃ ❌ DISABLED
╚════════════════════════════╝
`
    });
});

//
// 📵 ANTI CALL
//

cmd({
    pattern: 'anticall',
    alias: ['blockcall'],
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
        return reply('❌ Owner Only Command');
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
┃ Calls Will Be Rejected
╚══════════════════════╝
`,

        disableText: `
╔═══〔 📵 ANTI CALL 〕═══╗
┃ ❌ DISABLED
╚══════════════════════╝
`
    });
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
async (conn, mek, m, {
    sender,
    args,
    reply,
    isOwner
}) => {

    if (!isOwner) {
        return reply('❌ Owner Only Command');
    }

    await toggleSetting({
        sender,
        key: 'AUTO_RECORDING',
        action: args[0],
        reply,
        title: 'Auto Recording',

        enableText: `
╔═══〔 🎙️ AUTO RECORDING 〕═══╗
┃ ✅ ENABLED
┃ Recording Presence Active
╚═══════════════════════════╝
`,

        disableText: `
╔═══〔 🎙️ AUTO RECORDING 〕═══╗
┃ ❌ DISABLED
╚═══════════════════════════╝
`
    });
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
async (conn, mek, m, {
    sender,
    args,
    reply,
    isOwner
}) => {

    if (!isOwner) {
        return reply('❌ Owner Only Command');
    }

    await toggleSetting({
        sender,
        key: 'AUTO_TYPING',
        action: args[0],
        reply,
        title: 'Auto Typing',

        enableText: `
╔═══〔 ⌨️ AUTO TYPING 〕═══╗
┃ ✅ ENABLED
┃ Typing Presence Active
╚════════════════════════╝
`,

        disableText: `
╔═══〔 ⌨️ AUTO TYPING 〕═══╗
┃ ❌ DISABLED
╚════════════════════════╝
`
    });
});

//
// ✅ AUTO READ
//

cmd({
    pattern: 'autoread',
    alias: ['readmessage', 'bluetick'],
    desc: 'Auto read messages',
    category: 'settings',
    react: '✅'
},
async (conn, mek, m, {
    sender,
    args,
    reply,
    isOwner
}) => {

    if (!isOwner) {
        return reply('❌ Owner Only Command');
    }

    await toggleSetting({
        sender,
        key: 'READ_MESSAGE',
        action: args[0],
        reply,
        title: 'Auto Read',

        enableText: `
╔═══〔 ✅ AUTO READ 〕═══╗
┃ ✅ ENABLED
┃ Messages Will Auto Read
╚══════════════════════╝
`,

        disableText: `
╔═══〔 ✅ AUTO READ 〕═══╗
┃ ❌ DISABLED
╚══════════════════════╝
`
    });
});

//
// 💎 AUTO VIEWONCE SAVE
//

cmd({
    pattern: 'autovv',
    alias: ['autosavevv', 'autoviewonce'],
    desc: 'Auto save ViewOnce media',
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
        return reply('❌ Owner Only Command');
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
┃ ViewOnce Media Will Save
┃ To Owner Inbox
╚══════════════════════════╝
`,

        disableText: `
╔═══〔 💎 AUTO VIEWONCE 〕═══╗
┃ ❌ DISABLED
╚══════════════════════════╝
`
    });
});

//
// 📊 SETTINGS STATUS
//

cmd({
    pattern: 'settings',
    desc: 'View all settings status',
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
            return reply('❌ Owner Only Command');
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

┃ 📵 Anti Call :
┃ ${userConfig.ANTI_CALL === 'true' ? 'ON ✅' : 'OFF ❌'}

┃ 🎙️ Auto Recording :
┃ ${userConfig.AUTO_RECORDING === 'true' ? 'ON ✅' : 'OFF ❌'}

┃ ⌨️ Auto Typing :
┃ ${userConfig.AUTO_TYPING === 'true' ? 'ON ✅' : 'OFF ❌'}

┃ ✅ Auto Read :
┃ ${userConfig.READ_MESSAGE === 'true' ? 'ON ✅' : 'OFF ❌'}

┃ 💎 Auto VV Save :
┃ ${userConfig.AUTO_VIEWONCE_SAVE === 'true' ? 'ON ✅' : 'OFF ❌'}

╚════════════════════════╝
`);

    } catch (e) {

        console.log(e);

        reply(`❌ ERROR\n\n${e.message}`);
    }
});
