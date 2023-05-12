const fs = require('fs/promises');
const handlebars = require('handlebars');

const compiladorHtml = async (caminho, dados) => {
    const html = await fs.readFile(caminho);

    const template = handlebars.compile(html.toString());

    const htmlString = template(dados);

    return htmlString;
};

module.exports = compiladorHtml;