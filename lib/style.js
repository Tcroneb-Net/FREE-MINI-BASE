function success(title, text) {

    return `
╔═══〔 ${title} 〕═══╗
${text}
╚════════════════════╝
`;
}

function error(text) {

    return `
╔═══〔 ❌ ERROR 〕═══╗
┃ ${text}
╚════════════════════╝
`;
}

function loading(text) {

    return `
╔═══〔 ⏳ PROCESSING 〕═══╗
┃ ${text}
╚════════════════════════╝
`;
}

module.exports = {
    success,
    error,
    loading
};
