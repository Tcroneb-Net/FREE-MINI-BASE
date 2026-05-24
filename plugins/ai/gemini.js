const { cmd } = require('../../inconnuboy');

const { post } = require('../../lib/api');

const {
    loading,
    error
} = require('../../lib/style');

cmd({
    pattern: 'gemini',
    desc: 'Chat with Gemini AI',
    category: 'ai',
    react: '🤖'
},
async (conn, mek, m, {
    q,
    reply
}) => {

    try {

        if (!q) {
            return reply('❌ Ask Something');
        }

        await reply(
            loading('Gemini Thinking...')
        );

        const data = await post(
            '/api/ai/gemini',
            {
                prompt: q
            }
        );

        const text =
            data.result ||
            data.response ||
            'No Response';

        reply(`
╔═══〔 🤖 GEMINI AI 〕═══╗

${text}

╚══════════════════════╝
`);

    } catch (e) {

        console.log(e);

        reply(error(e.message));
    }
});
