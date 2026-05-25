const { cmd } = require('../inconnuboy');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

//
// 🎵 YOUTUBE AUDIO DOWNLOAD
// 🔥 ULTRA FIXED VERSION
//

cmd({
    pattern: "song",
    alias: ["audio", "mp3", "yta"],
    desc: "Download YouTube audio by name or link",
    category: "download",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, {
    from,
    args,
    reply
}) => {

    try {

        //
        // ❌ NO QUERY
        //

        if (!args[0]) {

            return reply(`
╭━━━〔 🎵 YOUTUBE AUDIO 〕━━━⬣
┃ ❌ Please Provide Song Name
┃ Or YouTube Link
┃
┃ 📌 Example :
┃ .song Faded Alan Walker
┃ .mp3 https://youtu.be/xxxx
┃
┃ 🎧 High Quality Audio
┃ ⚡ Fast Download System
╰━━━━━━━━━━━━━━━━━━━━⬣

> 💎 HOSTIFY AI MINI
`);
        }

        //
        // QUERY
        //

        const query =
            args.join(" ");

        const start =
            Date.now();

        //
        // REACT
        //

        await conn.sendMessage(from, {
            react: {
                text: "⏳",
                key: mek.key
            }
        });

        //
        // CHECK URL
        //

        let videoUrl = query;

        const isUrl =

            query.includes("youtube.com") ||
            query.includes("youtu.be");

        //
        // 🔍 SEARCH YOUTUBE
        //

        if (!isUrl) {

            const searchUrl =
                `https://api.hostify.indevs.in/api/search/youtube?q=${encodeURIComponent(query)}`;

            const searchRes =
                await axios.get(searchUrl);

            const results =
                searchRes.data?.result ||
                searchRes.data?.results ||
                [];

            //
            // NO RESULT
            //

            if (!results.length) {

                return reply(`
╭━━━〔 ❌ NOT FOUND 〕━━━⬣
┃ No Song Found
╰━━━━━━━━━━━━━━━━━━━━⬣
`);
            }

            //
            // FIRST VIDEO
            //

            videoUrl =
                results[0].url ||
                results[0].link;
        }

        //
        // 🎵 DOWNLOAD MP3
        //

        const apiRes =
            await axios.post(
                'https://api.hostify.indevs.in/api/downloader/ytmp3',
                {
                    url: videoUrl
                },
                {
                    headers: {
                        'Content-Type':
                            'application/json'
                    },
                    timeout: 60000
                }
            );

        const data =
            apiRes.data;

        //
        // DEBUG
        //

        console.log(
            JSON.stringify(data, null, 2)
        );

        //
        // SAFE RESULT
        //

        const result =
            data?.result ||
            data?.data ||
            {};

        //
        // AUDIO URL
        //

        const audioUrl =

            result.download_url ||
            result.audio ||
            result.mp3 ||
            result.url;

        //
        // TITLE
        //

        const title =

            result.title ||
            'YouTube Audio';

        //
        // THUMBNAIL
        //

        const thumbnail =

            result.thumbnail ||
            result.thumb ||
            result.image;

        //
        // CHECK AUDIO
        //

        if (!audioUrl) {

            return reply(`
╭━━━〔 ❌ DOWNLOAD FAILED 〕━━━⬣
┃ Unable To Download Audio
╰━━━━━━━━━━━━━━━━━━━━⬣
`);
        }

        //
        // 📥 DOWNLOAD AUDIO BUFFER
        //

        const audioBuffer =
            (
                await axios.get(
                    audioUrl,
                    {
                        responseType:
                            'arraybuffer'
                    }
                )
            ).data;

        //
        // TEMP FILES
        //

        const inputPath =
            path.join(
                __dirname,
                `${Date.now()}.mp3`
            );

        const outputPath =
            path.join(
                __dirname,
                `${Date.now()}.ogg`
            );

        //
        // SAVE MP3
        //

        fs.writeFileSync(
            inputPath,
            audioBuffer
        );

        //
        // 🔥 CONVERT TO OGG OPUS
        //

        await new Promise(
            (resolve, reject) => {

                ffmpeg(inputPath)

                    .audioCodec('libopus')

                    .format('ogg')

                    .save(outputPath)

                    .on(
                        'end',
                        resolve
                    )

                    .on(
                        'error',
                        reject
                    );
            }
        );

        //
        // ⏱️ SPEED
        //

        const speed =
            (
                (
                    Date.now() - start
                ) / 1000
            ).toFixed(2);

        //
        // 📢 INFO MESSAGE
        //

        if (thumbnail) {

            await conn.sendMessage(
                from,
                {
                    image: {
                        url: thumbnail
                    },

                    caption: `
╭━━━〔 🎵 AUDIO INFO 〕━━━⬣
┃ 🎼 Title :
┃ ${title}
┃
┃ ⚡ Speed :
┃ ${speed}s
┃
┃ 🚀 Uploading Audio...
╰━━━━━━━━━━━━━━━━━━━━⬣

> 💎 HOSTIFY AI MINI
`
                },
                { quoted: mek }
            );
        }

        //
        // 🎧 SEND AUDIO
        //

        await conn.sendMessage(
            from,
            {
                audio:
                    fs.readFileSync(
                        outputPath
                    ),

                mimetype:
                    'audio/ogg; codecs=opus',

                ptt: false,

                fileName:
                    `${title}.ogg`
            },
            {
                quoted: mek
            }
        );

        //
        // 🧹 DELETE TEMP FILES
        //

        fs.unlinkSync(inputPath);

        fs.unlinkSync(outputPath);

        //
        // ✅ SUCCESS REACTION
        //

        await conn.sendMessage(from, {
            react: {
                text: '✅',
                key: mek.key
            }
        });

    } catch (err) {

        console.error(
            'SONG ERROR:',
            err
        );

        reply(`
╭━━━〔 ❌ ERROR 〕━━━⬣
┃ Failed To Download Audio
┃ Please Try Again Later
╰━━━━━━━━━━━━━━━━━━━━⬣
`);
    }
});
