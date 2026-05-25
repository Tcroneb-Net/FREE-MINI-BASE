const { cmd } = require('../inconnuboy');

const {
    getUserConfigFromMongoDB,
    updateUserConfigInMongoDB
} = require('../lib/database');

//
// ╔══════════════════════════════╗
// ║       SETTINGS SYSTEM        ║
// ╚══════════════════════════════╝
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

        const number =
            sender.split('@')[0];

        let userConfig =
            await getUserConfigFromMongoDB(number);

        if (
            !userConfig ||
            typeof userConfig !== 'object'
        ) {

            userConfig = {};
        }

        const current =
            userConfig[key] === 'true';

        //
        // SHOW STATUS
        //

        if (!action) {

            return reply(`
╭━━━〔 ⚙️ ${title.toUpperCase()} 〕━━━⬣
┃ STATUS : ${current ? 'ON ✅' : 'OFF ❌'}
┃
┃ USAGE :
┃ .${key.toLowerCase()} on
┃ .${key.toLowerCase()} off
╰━━━━━━━━━━━━━━━━━━━━⬣
`);
        }

        const input =
            action.toLowerCase();

        if (
            !['on', 'off']
            .includes(input)
        ) {

            return reply(`
╭━━━〔 ❌ INVALID OPTION 〕━━━⬣
┃ Example :
┃ .${key.toLowerCase()} on
┃ .${key.toLowerCase()} off
╰━━━━━━━━━━━━━━━━━━━━⬣
`);
        }

        //
        // SAVE
        //

        const newValue =
            input === 'on';

        userConfig[key] =
            String(newValue);

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

        reply(`
╭━━━〔 ❌ ERROR 〕━━━⬣
┃ ${e.message}
╰━━━━━━━━━━━━━━━━━━━━⬣
`);
    }
}

//
// 👁️ AUTO VIEW STATUS
//

cmd({
    pattern: 'autoviewstatus',

    alias: [
        'autoview',
        'autostatus'
    ],

    desc: 'Auto view statuses',

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

        key:
            'AUTO_VIEW_STATUS',

        action:
            args[0],

        reply,

        title:
            'Auto View Status',

        enableText: `
╭━━━〔 👁️ AUTO VIEW STATUS 〕━━━⬣
┃ ✅ ENABLED
┃ Bot Will Auto View Status
╰━━━━━━━━━━━━━━━━━━━━⬣
`,

        disableText: `
╭━━━〔 👁️ AUTO VIEW STATUS 〕━━━⬣
┃ ❌ DISABLED
╰━━━━━━━━━━━━━━━━━━━━⬣
`
    });
});

//
// 😍 AUTO LIKE STATUS
//

cmd({
    pattern: 'autolikestatus',

    alias: [
        'autolike',
        'statuslike'
    ],

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

        key:
            'AUTO_LIKE_STATUS',

        action:
            args[0],

        reply,

        title:
            'Auto Like Status',

        enableText: `
╭━━━〔 😍 AUTO LIKE STATUS 〕━━━⬣
┃ ✅ ENABLED
┃ Bot Will React To Statuses
╰━━━━━━━━━━━━━━━━━━━━⬣
`,

        disableText: `
╭━━━〔 😍 AUTO LIKE STATUS 〕━━━⬣
┃ ❌ DISABLED
╰━━━━━━━━━━━━━━━━━━━━⬣
`
    });
});

//
// 😀 SET AUTO LIKE EMOJIS
//

cmd({
    pattern: 'setlikeemoji',

    alias: [
        'setemoji',
        'setreactemoji'
    ],

    desc: 'Set auto status reaction emojis',

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

        if (!args[0]) {

            return reply(`
╭━━━〔 😀 SET STATUS EMOJIS 〕━━━⬣
┃ Example :
┃ .setlikeemoji ❤️ 😍 🔥 💎
╰━━━━━━━━━━━━━━━━━━━━⬣
`);
        }

        const number =
            sender.split('@')[0];

        let userConfig =
            await getUserConfigFromMongoDB(number);

        if (
            !userConfig ||
            typeof userConfig !== 'object'
        ) {

            userConfig = {};
        }

        //
        // SAVE EMOJIS
        //

        userConfig.AUTO_LIKE_EMOJI =
            args;

        await updateUserConfigInMongoDB(
            number,
            userConfig
        );

        reply(`
╭━━━〔 😀 STATUS EMOJIS 〕━━━⬣
┃ ✅ SAVED SUCCESSFULLY
┃
┃ ${args.join(' ')}
╰━━━━━━━━━━━━━━━━━━━━⬣
`);

    } catch (e) {

        console.log(e);

        reply(`
╭━━━〔 ❌ ERROR 〕━━━⬣
┃ ${e.message}
╰━━━━━━━━━━━━━━━━━━━━⬣
`);
    }
});

//
// 📵 ANTI CALL
//

cmd({
    pattern: 'anticall',

    alias: [
        'blockcall'
    ],

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

        key:
            'ANTI_CALL',

        action:
            args[0],

        reply,

        title:
            'Anti Call',

        enableText: `
╭━━━〔 📵 ANTI CALL 〕━━━⬣
┃ ✅ ENABLED
┃ Incoming Calls Will Reject
╰━━━━━━━━━━━━━━━━━━━━⬣
`,

        disableText: `
╭━━━〔 📵 ANTI CALL 〕━━━⬣
┃ ❌ DISABLED
╰━━━━━━━━━━━━━━━━━━━━⬣
`
    });
});

//
// 🎙️ AUTO RECORDING
//

cmd({
    pattern: 'autorecording',

    alias: [
        'autorecord'
    ],

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

        return reply('❌ OWNER ONLY');
    }

    await toggleSetting({

        sender,

        key:
            'AUTO_RECORDING',

        action:
            args[0],

        reply,

        title:
            'Auto Recording',

        enableText: `
╭━━━〔 🎙️ AUTO RECORDING 〕━━━⬣
┃ ✅ ENABLED
┃ Bot Will Show Recording
╰━━━━━━━━━━━━━━━━━━━━⬣
`,

        disableText: `
╭━━━〔 🎙️ AUTO RECORDING 〕━━━⬣
┃ ❌ DISABLED
╰━━━━━━━━━━━━━━━━━━━━⬣
`
    });
});

//
// ⌨️ AUTO TYPING
//

cmd({
    pattern: 'autotyping',

    alias: [
        'autotype'
    ],

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

        return reply('❌ OWNER ONLY');
    }

    await toggleSetting({

        sender,

        key:
            'AUTO_TYPING',

        action:
            args[0],

        reply,

        title:
            'Auto Typing',

        enableText: `
╭━━━〔 ⌨️ AUTO TYPING 〕━━━⬣
┃ ✅ ENABLED
┃ Bot Will Show Typing
╰━━━━━━━━━━━━━━━━━━━━⬣
`,

        disableText: `
╭━━━〔 ⌨️ AUTO TYPING 〕━━━⬣
┃ ❌ DISABLED
╰━━━━━━━━━━━━━━━━━━━━⬣
`
    });
});

//
// ✅ AUTO READ
//

cmd({
    pattern: 'autoread',

    alias: [
        'readmessage',
        'bluetick'
    ],

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

        return reply('❌ OWNER ONLY');
    }

    await toggleSetting({

        sender,

        key:
            'READ_MESSAGE',

        action:
            args[0],

        reply,

        title:
            'Auto Read',

        enableText: `
╭━━━〔 ✅ AUTO READ 〕━━━⬣
┃ ✅ ENABLED
┃ Messages Will Auto Read
╰━━━━━━━━━━━━━━━━━━━━⬣
`,

        disableText: `
╭━━━〔 ✅ AUTO READ 〕━━━⬣
┃ ❌ DISABLED
╰━━━━━━━━━━━━━━━━━━━━⬣
`
    });
});

//
// ⚙️ SETTINGS PANEL
//

cmd({
    pattern: 'settings',

    alias: [
        'setting',
        'config'
    ],

    desc: 'View bot settings',

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

        const number =
            sender.split('@')[0];

        let userConfig =
            await getUserConfigFromMongoDB(number);

        if (
            !userConfig ||
            typeof userConfig !== 'object'
        ) {

            userConfig = {};
        }

        reply(`
╔══════════════════════╗
║     ⚙️ BOT SETTINGS     ║
╚══════════════════════╝

╭━━━〔 👁️ STATUS VIEW 〕━━━⬣
┃ ${
    userConfig.AUTO_VIEW_STATUS === 'true'
        ? 'ON ✅'
        : 'OFF ❌'
}
╰━━━━━━━━━━━━━━━━━━━━⬣

╭━━━〔 😍 STATUS LIKE 〕━━━⬣
┃ ${
    userConfig.AUTO_LIKE_STATUS === 'true'
        ? 'ON ✅'
        : 'OFF ❌'
}
╰━━━━━━━━━━━━━━━━━━━━⬣

╭━━━〔 😀 REACTION EMOJIS 〕━━━⬣
┃ ${
    Array.isArray(
        userConfig.AUTO_LIKE_EMOJI
    )
        ? userConfig.AUTO_LIKE_EMOJI.join(' ')
        : '❤️ 🔥 😍'
}
╰━━━━━━━━━━━━━━━━━━━━⬣

╭━━━〔 📵 ANTI CALL 〕━━━⬣
┃ ${
    userConfig.ANTI_CALL === 'true'
        ? 'ON ✅'
        : 'OFF ❌'
}
╰━━━━━━━━━━━━━━━━━━━━⬣

╭━━━〔 🎙️ AUTO RECORDING 〕━━━⬣
┃ ${
    userConfig.AUTO_RECORDING === 'true'
        ? 'ON ✅'
        : 'OFF ❌'
}
╰━━━━━━━━━━━━━━━━━━━━⬣

╭━━━〔 ⌨️ AUTO TYPING 〕━━━⬣
┃ ${
    userConfig.AUTO_TYPING === 'true'
        ? 'ON ✅'
        : 'OFF ❌'
}
╰━━━━━━━━━━━━━━━━━━━━⬣

╭━━━〔 ✅ AUTO READ 〕━━━⬣
┃ ${
    userConfig.READ_MESSAGE === 'true'
        ? 'ON ✅'
        : 'OFF ❌'
}
╰━━━━━━━━━━━━━━━━━━━━⬣

> FREE WHATSBOT MINI
`);

    } catch (e) {

        console.log(e);

        reply(`
╭━━━〔 ❌ ERROR 〕━━━⬣
┃ ${e.message}
╰━━━━━━━━━━━━━━━━━━━━⬣
`);
    }
});

module.exports = {};
