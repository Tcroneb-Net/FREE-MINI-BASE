const { cmd } = require('../inconnuboy');

cmd({
    pattern: 'mycommand',
    alias: ['hello', 'test'],
    desc: 'My ultra command',
    category: 'general',
    react: '🔥'
},
async (conn, mek, m, {
    from,
    pushname,
    reply,
    isOwner
}) => {

    try {

        reply(`
╔═══〔 🤖 ULTRA COMMAND 〕═══╗
┃ 👋 Hello ${pushname || 'User'}
┃
┃ ✅ Plugin Working Perfectly
┃ 🚀 HOSTIFY AI MINI ONLINE
┃
┃ 👑 Owner : ${isOwner ? 'YES' : 'NO'}
╚══════════════════════════╝
`);

    } catch (e) {

        console.log(e);

        reply(`
❌ COMMAND ERROR

${e.message}
`);
    }
});
