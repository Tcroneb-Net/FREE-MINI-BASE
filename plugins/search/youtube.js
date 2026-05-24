const { cmd } = require('../../inconnuboy');

const { get } = require('../../lib/api');

const {
    success,
    error,
    loading
} = require('../../lib/style');

cmd({
    pattern: 'ytsearch',
    alias: ['yts'],
    desc: 'Search YouTube videos',
    category: 'search',
    react: '🎬'
},
async (conn, mek, m, {
    from,
    q,
    reply
}) => {

    try {

        if (!q) {
            return reply('❌ Give Search Query');
        }

        await reply(
            loading('Searching YouTube...')
        );

        const data = await get(
            `/api/search/youtube?q=${encodeURIComponent(q)}`
        );

        if (!data || data.status === false) {
            return reply(
                error('API Request Failed')
            );
        }

        const results =
            data.result ||
            data.results ||
            [];

        if (!results.length) {
            return reply(
                error('No Results Found')
            );
        }

        let text = `
╔═══〔 🎬 YOUTUBE SEARCH 〕═══╗
┃ QUERY : ${q}
╚══════════════════════════╝
`;

        results.slice(0, 10).forEach((v, i) => {

            text += `
╭─❍ RESULT ${i + 1}
┃ 🎥 ${v.title || 'Unknown'}
┃ 👤 ${v.author?.name || 'Unknown'}
┃ ⏱️ ${v.duration || 'Unknown'}
┃ 👁️ ${v.views || 'Unknown'}
┃ 🔗 ${v.url || ''}
╰───────────────⬣
`;
        });

        reply(text);

    } catch (e) {

        console.log(e);

        reply(error(e.message));
    }
});
