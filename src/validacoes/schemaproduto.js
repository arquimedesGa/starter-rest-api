const joi = require('joi');

const schemaproduto = joi.object({
    descricao: joi.string().required().messages({
        'string.empty': 'O campo descricao não pode estar vazio',
        'any.required': 'O campo descricao é obrigatório',
    }),
    quantidade_estoque: joi.number().integer().required().messages({
        'number.base': 'O campo quantidade_estoque deve ser um número inteiro',
        'number.empty': 'O campo quantidade_estoque não pode estar vazio',
        'any.required': 'O campo quantidade_estoque é obrigatório',
    }),

    valor: joi.number().required().messages({
        'number.base': 'O campo valor deve ser um número',
        'number.empty': 'O campo valor não pode estar vazio',
        'any.required': 'O campo valor é obrigatório',
    }),
    categoria_id: joi.number().required().messages({
        'number.base': 'O campo valor deve ser um número',
        'any.required': 'O campo categoria_id é obrigatório',
        'number.empty': 'O campo categoria_id não pode estar vazio',
    }),
});

module.exports = schemaproduto;