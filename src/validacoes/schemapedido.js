const joi = require('joi');

const schemaPedido = joi.object({
    cliente_id: joi.number().integer().required().messages({
        'number.base': 'O campo cliente_id deve ser um número inteiro',
        'any.required': 'O campo cliente_id é obrigatório',
    }),
    observacao: joi.string().allow('').messages({
        'string.base': 'O campo observacao deve ser um texto',
    }),
    pedido_produtos: joi.array().items(
        joi.object({
            produto_id: joi.number().integer().min(1).required().messages({
                'number.base': 'O campo produto_id deve ser um número inteiro',
                'any.required': 'O campo produto_id é obrigatório',
                'number.min': 'O campo produto_id deve ser maior que 0',
            }),
            quantidade_produto: joi.number().integer().min(1).required().messages({
                'number.base': 'O campo quantidade_produto deve ser um número inteiro',
                'any.required': 'O campo quantidade_produto é obrigatório',
                'number.min': 'O campo quantidade_produto deve ser maior que 0',
            }),
        })
    ).required().messages({
        'any.required': 'O campo pedido_produtos é obrigatório',
    }),
});

module.exports = schemaPedido;