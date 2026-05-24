const { cmd } = require('../inconnuboy');

const {
    ai
} = require('../lib/fetch');

//
// 🤖 AI MODELS
//

const MODELS = {

    gemini: {
        endpoint: '/api/ai/gemini',
        emoji: '💎',
        name: 'GEMINI AI'
    },

    grok: {
        endpoint: '/api/ai/grok',
        emoji: '🚀',
        name: 'GROK AI'
    },

    letmegpt: {
        endpoint: '/api/ai/letmegpt',
        emoji: '🤖',
        name: 'LETMEGPT'
    },

    notegpt: {
        endpoint: '/api/ai/notegpt',
        emoji: '🧠',
        name: 'NOTE GPT'
    }
};

//
// ⚡ MAIN AI HANDLER
//

async function handleAI({
    conn,
    mek,
    from,
    q,
    reply,
    modelKey,
    pushname
}) {

    try {

        //
        // CHECK PROMPT
        //

        if (!q) {

            return reply(`
╔═══〔 ${MODELS[modelKey].emoji} ${MODELS[modelKey].name} 〕═══╗
┃ ❌ Please Ask Something
┃
┃ Example:
┃ .${modelKey} Hello
╚══════════════════════════════╝
`);
        }

        //
        // REACT
        //

        await conn.sendMessage(from, {
            react: {
                text: MODELS[modelKey].emoji,
                key: mek.key
            }
        });

        //
        // LOADING
        //

        const loading = await conn.sendMessage(
            from,
            {
                text: `
╔═══〔 ⏳ ${MODELS[modelKey].name} 〕═══╗
┃ 🧠 Thinking...
┃ 🚀 Please Wait
╚════════════════════════════╝
`
            },
            { quoted: mek }
        );

        //
        // API CALL
        //

        let data;

        //
        // NOTEGPT
        //

        if (modelKey === 'notegpt') {

            data = await ai(
                MODELS[modelKey].endpoint,
                q,
                {
                    model:
                        'TA/deepseek-ai/DeepSeek-R1',

                    chat_mode:
                        'deep_think'
                }
            );

        } else {

            data = await ai(
                MODELS[modelKey].endpoint,
                q
            );
        }

        //
        // ERROR
        //

        if (!data.status) {

            return reply(`
╔═══〔 ❌ AI ERROR 〕═══╗
┃ ${data.error}
╚══════════════════════╝
`);
        }

        //
        // RESPONSE
        //

        const result =
            data.result.result ||
            data.result.response ||
            data.result.text ||
            data.result.message ||
            JSON.stringify(data.result);

        //
        // SEND
        //

        await conn.sendMessage(
            from,
            {
                text: `
╔═══〔 ${MODELS[modelKey].emoji} ${MODELS[modelKey].name} 〕═══╗

┃ 👤 USER :
┃ ${pushname || 'User'}

┃ ❓ QUESTION :
┃ ${q}

╠═══════════════════════╗

${result}

╚═══════════════════════╝

> POWERED BY HOSTIFY AI MINI
`,

                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,

                    forwardedNewsletterMessageInfo: {
                        newsletterJid:
                            '120363406434037642@newsletter',

                        newsletterName:
                            'HOSTIFY AI MINI',

                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

        //
        // SUCCESS REACTION
        //

        await conn.sendMessage(from, {
            react: {
                text: '✅',
                key: mek.key
            }
        });

    } catch (e) {

        console.log('AI ERROR:', e);

        reply(`
╔═══〔 ❌ AI ERROR 〕═══╗
┃ ${e.message}
╚══════════════════════╝
`);
    }
}

//
// 💎 GEMINI
//

cmd({
    pattern: 'gemini',
    alias: ['bard'],
    desc: 'Chat with Gemini AI',
    category: 'ai',
    react: '💎'
},
async (conn, mek, m, {
    from,
    q,
    reply,
    pushname
}) => {

    handleAI({
        conn,
        mek,
        from,
        q,
        reply,
        pushname,
        modelKey: 'gemini'
    });
});

//
// 🚀 GROK
//

cmd({
    pattern: 'grok',
    alias: ['xai'],
    desc: 'Chat with Grok AI',
    category: 'ai',
    react: '🚀'
},
async (conn, mek, m, {
    from,
    q,
    reply,
    pushname
}) => {

    handleAI({
        conn,
        mek,
        from,
        q,
        reply,
        pushname,
        modelKey: 'grok'
    });
});

//
// 🤖 LETMEGPT
//

cmd({
    pattern: 'gpt',
    alias: ['chatgpt', 'ai'],
    desc: 'Chat with GPT AI',
    category: 'ai',
    react: '🤖'
},
async (conn, mek, m, {
    from,
    q,
    reply,
    pushname
}) => {

    handleAI({
        conn,
        mek,
        from,
        q,
        reply,
        pushname,
        modelKey: 'letmegpt'
    });
});

//
// 🧠 NOTEGPT
//

cmd({
    pattern: 'notegpt',
    alias: ['deepseek'],
    desc: 'Chat with DeepSeek AI',
    category: 'ai',
    react: '🧠'
},
async (conn, mek, m, {
    from,
    q,
    reply,
    pushname
}) => {

    handleAI({
        conn,
        mek,
        from,
        q,
        reply,
        pushname,
        modelKey: 'notegpt'
    });
});

//
// ⚡ AI MENU
//

cmd({
    pattern: 'aimenu',
    alias: ['models', 'aihelp'],
    desc: 'Show AI models',
    category: 'ai',
    react: '⚡'
},
async (conn, mek, m, {
    reply
}) => {

    reply(`
╔═══〔 🤖 AI MODELS 〕═══╗

┃ 💎 .gemini
┃ 🚀 .grok
┃ 🤖 .gpt
┃ 🧠 .notegpt

╠═══════════════════════╗

┃ EXAMPLES:
┃ .gpt Hello
┃ .gemini Explain AI
┃ .grok Who made JS?
┃ .notegpt Quantum Physics

╚═══════════════════════╝

> HOSTIFY AI MINI
`);
});

//
// 🔥 AUTO AI CHAT
//

cmd({
    on: 'body'
},
async (conn, mek, m, {
    body,
    from,
    isGroup
}) => {

    try {

        //
        // ONLY WHEN BOT PREFIXED
        //

        if (!body.startsWith('ai ')) return;

        const question =
            body.slice(3);

        if (!question) return;

        //
        // THINK REACTION
        //

        await conn.sendMessage(from, {
            react: {
                text: '🤖',
                key: mek.key
            }
        });

    } catch (e) {

        console.log(e);
    }
});
