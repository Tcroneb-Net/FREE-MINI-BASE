const { cmd } = require('../inconnuboy');

const {
    downloadContentFromMessage
} = require('@whiskeysockets/baileys');

cmd({
    pattern: "vv",

    alias: [

        // MAIN
        "viewonce",
        "reveal",

        // SHORT
        "v",
        "vv2",

        // FUN
        "wow",
        "cool",
        "good",
        "nice",
        "ohh",
        "damn",
        "oho",
        "wah",
        "private",
        "open",
        "see",
        "check"
    ],

    desc: "Reveal ViewOnce Image/Video/Audio",

    category: "tools",

    react: "👁️",

    filename: __filename
},
async (
    conn,
    mek,
    m,
    {
        from,
        sender,
        reply
    }
) => {

    try {

        //
        // GET QUOTED MESSAGE
        //

        const quoted =

            mek.message
            ?.extendedTextMessage
            ?.contextInfo
            ?.quotedMessage;

        //
        // NO QUOTED
        //

        if (!quoted) {

            return reply(`
╭━━━〔 👁️ VIEWONCE OPENER 〕━━━⬣
┃
┃ Reply To A ViewOnce Message
┃ Then Type :
┃
┃ .vv
┃ .v
┃ .wow
┃ .nice
┃ .cool
┃ .damn
┃
╰━━━━━━━━━━━━━━━━━━━⬣
`);
        }

        //
        // VIEWONCE WRAPPER
        //

        const viewOnceMsg =

            quoted.viewOnceMessageV2 ||

            quoted.viewOnceMessageV2Extension ||

            quoted.viewOnceMessage ||

            null;

        //
        // MEDIA
        //

        const mediaMessage =

            viewOnceMsg?.message?.imageMessage ||

            viewOnceMsg?.message?.videoMessage ||

            viewOnceMsg?.message?.audioMessage ||

            null;

        //
        // CHECK
        //

        if (!mediaMessage) {

            return reply(`
╭━━━〔 ❌ ERROR 〕━━━⬣
┃ This Is Not A ViewOnce Media
╰━━━━━━━━━━━━━━━━━━━━⬣
`);
        }

        //
        // MEDIA TYPE
        //

        const isImage =
            !!viewOnceMsg?.message?.imageMessage;

        const isVideo =
            !!viewOnceMsg?.message?.videoMessage;

        const isAudio =
            !!viewOnceMsg?.message?.audioMessage;

        //
        // RANDOM REACTION
        //

        const reactionEmojis = [

            '👀',
            '🔥',
            '😎',
            '💎',
            '✨',
            '⚡'
        ];

        const reactEmoji =

            reactionEmojis[
                Math.floor(
                    Math.random() *
                    reactionEmojis.length
                )
            ];

        //
        // REACT
        //

        await conn.sendMessage(
            from,
            {
                react: {
                    text: reactEmoji,
                    key: mek.key
                }
            }
        );

        //
        // DOWNLOAD STREAM
        //

        const stream =
            await downloadContentFromMessage(

                mediaMessage,

                isImage
                    ? 'image'
                    : isVideo
                    ? 'video'
                    : 'audio'
            );

        //
        // BUFFER
        //

        let buffer =
            Buffer.from([]);

        for await (const chunk of stream) {

            buffer =
                Buffer.concat([
                    buffer,
                    chunk
                ]);
        }

        //
        // SEND IMAGE
        //

        if (isImage) {

            return await conn.sendMessage(
                from,
                {
                    image: buffer,

                    caption:
                        mediaMessage.caption ||
                        `
╭━━━〔 👁️ VIEWONCE OPENED 〕━━━⬣
┃ 🖼️ Image Opened Successfully
╰━━━━━━━━━━━━━━━━━━━━⬣
`
                },
                {
                    quoted: mek
                }
            );
        }

        //
        // SEND VIDEO
        //

        if (isVideo) {

            return await conn.sendMessage(
                from,
                {
                    video: buffer,

                    mimetype:
                        'video/mp4',

                    caption:
                        mediaMessage.caption ||
                        `
╭━━━〔 👁️ VIEWONCE OPENED 〕━━━⬣
┃ 🎥 Video Opened Successfully
╰━━━━━━━━━━━━━━━━━━━━⬣
`
                },
                {
                    quoted: mek
                }
            );
        }

        //
        // SEND AUDIO
        //

        if (isAudio) {

            return await conn.sendMessage(
                from,
                {
                    audio: buffer,

                    mimetype:
                        'audio/mp4',

                    ptt: false
                },
                {
                    quoted: mek
                }
            );
        }

    } catch (err) {

        console.log(
            'VV ERROR:',
            err
        );

        reply(`
╭━━━〔 ❌ VIEWONCE FAILED 〕━━━⬣
┃ Unable To Open Media
┃
┃ ${err.message}
╰━━━━━━━━━━━━━━━━━━━━⬣
`);
    }
});
