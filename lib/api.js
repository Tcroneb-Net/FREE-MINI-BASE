const axios = require('axios');

const BASE_URL = 'https://api.hostify.indevs.in';

async function get(endpoint) {

    try {

        const res = await axios.get(
            BASE_URL + endpoint
        );

        return res.data;

    } catch (e) {

        console.log('GET API ERROR:', e.message);

        return {
            status: false,
            error: e.message
        };
    }
}

async function post(endpoint, data = {}) {

    try {

        const res = await axios.post(
            BASE_URL + endpoint,
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        return res.data;

    } catch (e) {

        console.log('POST API ERROR:', e.message);

        return {
            status: false,
            error: e.message
        };
    }
}

module.exports = {
    get,
    post
};
