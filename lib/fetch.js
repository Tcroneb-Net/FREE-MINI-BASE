const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

//
// ╔══════════════════════════════╗
// ║        HOSTIFY FETCH        ║
// ╚══════════════════════════════╝
//

const BASE_URL = 'https://api.hostify.indevs.in';

//
// ⚡ DEFAULT HEADERS
//

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'User-Agent': 'HOSTIFY-AI-MINI'
};

//
// 🌐 BASIC GET
//

async function get(endpoint, headers = {}) {

    try {

        const response = await axios({
            method: 'GET',

            url: BASE_URL + endpoint,

            headers: {
                ...DEFAULT_HEADERS,
                ...headers
            },

            timeout: 60000
        });

        return {
            status: true,
            code: response.status,
            result: response.data
        };

    } catch (e) {

        console.log('GET ERROR:', e.message);

        return {
            status: false,
            error: e.message
        };
    }
}

//
// 🚀 BASIC POST
//

async function post(
    endpoint,
    data = {},
    headers = {}
) {

    try {

        const response = await axios({
            method: 'POST',

            url: BASE_URL + endpoint,

            data,

            headers: {
                ...DEFAULT_HEADERS,
                ...headers
            },

            timeout: 120000
        });

        return {
            status: true,
            code: response.status,
            result: response.data
        };

    } catch (e) {

        console.log('POST ERROR:', e.message);

        return {
            status: false,
            error: e.message
        };
    }
}

//
// 🔍 SEARCH HELPER
//

async function search(endpoint, query) {

    try {

        const response = await axios({
            method: 'GET',

            url:
                BASE_URL +
                endpoint +
                encodeURIComponent(query),

            headers: DEFAULT_HEADERS,

            timeout: 60000
        });

        return {
            status: true,
            result: response.data
        };

    } catch (e) {

        console.log('SEARCH ERROR:', e.message);

        return {
            status: false,
            error: e.message
        };
    }
}

//
// 🤖 AI HELPER
//

async function ai(
    endpoint,
    prompt,
    extra = {}
) {

    try {

        const payload = {
            prompt,
            message: prompt,
            ...extra
        };

        const response = await axios({
            method: 'POST',

            url: BASE_URL + endpoint,

            data: payload,

            headers: DEFAULT_HEADERS,

            timeout: 180000
        });

        return {
            status: true,
            result: response.data
        };

    } catch (e) {

        console.log('AI ERROR:', e.message);

        return {
            status: false,
            error: e.message
        };
    }
}

//
// 🎵 DOWNLOADER
//

async function downloader(
    endpoint,
    url
) {

    try {

        const response = await axios({
            method: 'POST',

            url: BASE_URL + endpoint,

            data: {
                url
            },

            headers: DEFAULT_HEADERS,

            timeout: 180000
        });

        return {
            status: true,
            result: response.data
        };

    } catch (e) {

        console.log('DOWNLOADER ERROR:', e.message);

        return {
            status: false,
            error: e.message
        };
    }
}

//
// 📤 IMAGE UPLOAD
//

async function uploadImage(
    endpoint,
    filePath
) {

    try {

        const form = new FormData();

        form.append(
            'image',
            fs.createReadStream(filePath)
        );

        const response = await axios({
            method: 'POST',

            url: BASE_URL + endpoint,

            data: form,

            headers: {
                ...form.getHeaders()
            },

            maxBodyLength: Infinity,
            maxContentLength: Infinity,

            timeout: 180000
        });

        return {
            status: true,
            result: response.data
        };

    } catch (e) {

        console.log('UPLOAD ERROR:', e.message);

        return {
            status: false,
            error: e.message
        };
    }
}

//
// 📥 BUFFER FETCH
//

async function getBuffer(url) {

    try {

        const response = await axios({
            method: 'GET',

            url,

            responseType: 'arraybuffer',

            timeout: 180000
        });

        return {
            status: true,
            buffer: response.data
        };

    } catch (e) {

        console.log('BUFFER ERROR:', e.message);

        return {
            status: false,
            error: e.message
        };
    }
}

//
// 🎧 STREAM FETCH
//

async function stream(url) {

    try {

        const response = await axios({
            method: 'GET',

            url,

            responseType: 'stream',

            timeout: 180000
        });

        return {
            status: true,
            stream: response.data
        };

    } catch (e) {

        console.log('STREAM ERROR:', e.message);

        return {
            status: false,
            error: e.message
        };
    }
}

//
// 📡 RAW REQUEST
//

async function request(config = {}) {

    try {

        const response = await axios(config);

        return {
            status: true,
            result: response.data,
            headers: response.headers
        };

    } catch (e) {

        console.log('REQUEST ERROR:', e.message);

        return {
            status: false,
            error: e.message
        };
    }
}

//
// 🔥 AUTO DOWNLOADER DETECTOR
//

function detectDownloader(url = '') {

    if (
        url.includes('tiktok.com') ||
        url.includes('vt.tiktok.com')
    ) {

        return {
            name: 'TikTok',
            endpoint: '/api/downloader/tiktok'
        };
    }

    if (
        url.includes('instagram.com')
    ) {

        return {
            name: 'Instagram',
            endpoint: '/api/downloader/instagram'
        };
    }

    if (
        url.includes('facebook.com') ||
        url.includes('fb.watch')
    ) {

        return {
            name: 'Facebook',
            endpoint: '/api/downloader/fbdl'
        };
    }

    if (
        url.includes('youtube.com') ||
        url.includes('youtu.be')
    ) {

        return {
            name: 'YouTube',
            endpoint: '/api/downloader/youtube'
        };
    }

    return null;
}

//
// 💎 UNIVERSAL DOWNLOADER
//

async function autoDownload(url) {

    try {

        const detected =
            detectDownloader(url);

        if (!detected) {

            return {
                status: false,
                error: 'Unsupported URL'
            };
        }

        return await downloader(
            detected.endpoint,
            url
        );

    } catch (e) {

        console.log('AUTO DOWNLOAD ERROR:', e.message);

        return {
            status: false,
            error: e.message
        };
    }
}

//
// ⚡ RANDOM USER AGENT
//

function randomUA() {

    const agents = [

        'Mozilla/5.0',
        'Chrome/120.0',
        'Safari/537.36',
        'HOSTIFY-AI'
    ];

    return agents[
        Math.floor(
            Math.random() * agents.length
        )
    ];
}

//
// 📦 EXPORTS
//

module.exports = {

    //
    // BASIC
    //

    get,
    post,
    request,

    //
    // HELPERS
    //

    search,
    ai,
    downloader,

    //
    // MEDIA
    //

    uploadImage,
    getBuffer,
    stream,

    //
    // AUTO
    //

    detectDownloader,
    autoDownload,

    //
    // EXTRA
    //

    randomUA
};
