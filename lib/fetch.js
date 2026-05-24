const axios = require('axios');

//
// ⚡ ULTRA FETCH SYSTEM
//

const BASE_URL = 'https://api.hostify.indevs.in';

//
// 🔥 DEFAULT HEADERS
//

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'User-Agent': 'HOSTIFY-AI-MINI'
};

//
// 🌐 GET REQUEST
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
// 🚀 POST REQUEST
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

            timeout: 60000
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
// 📤 UPLOAD FORM DATA
//

async function upload(
    endpoint,
    formData,
    headers = {}
) {

    try {

        const response = await axios({
            method: 'POST',

            url: BASE_URL + endpoint,

            data: formData,

            headers: {
                ...formData.getHeaders(),
                ...headers
            },

            maxContentLength: Infinity,
            maxBodyLength: Infinity,

            timeout: 120000
        });

        return {
            status: true,
            code: response.status,
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
// 📥 DOWNLOAD BUFFER
//

async function buffer(url) {

    try {

        const response = await axios({
            method: 'GET',

            url,

            responseType: 'arraybuffer',

            timeout: 120000
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
// 🤖 AI REQUEST
//

async function ai(
    endpoint,
    prompt,
    extra = {}
) {

    try {

        const response = await axios({
            method: 'POST',

            url: BASE_URL + endpoint,

            data: {
                prompt,
                ...extra
            },

            headers: DEFAULT_HEADERS,

            timeout: 120000
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
// 🔍 SEARCH REQUEST
//

async function search(
    endpoint,
    query
) {

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
// 🎵 DOWNLOADER REQUEST
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

            timeout: 120000
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
// 💎 EXPORTS
//

module.exports = {

    get,
    post,
    upload,
    buffer,

    ai,
    search,
    downloader
};
