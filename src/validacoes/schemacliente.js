const joi = require('joi');

const schemaCliente = joi.object({
    nome: joi.string().min(3).max(50).required().messages({
        'string.min': 'O campo nome deve ter no mínimo 3 caracteres',
        'string.max': 'O campo nome deve ter no máximo 50 caracteres',
        'string.empty': 'O campo nome não pode estar vazio',
        'any.required': 'O campo nome é obrigatório',
        'string.base': 'O campo cpf deve ser um texto',
    }),
    email: joi.string().email().required().messages({
        'string.email': 'O campo email deve ser um email válido',
        'string.empty': 'O campo email não pode estar vazio',
        'any.required': 'O campo email é obrigatório',
        'string.base': 'O campo cpf deve ser um texto',
    }),
    cpf: joi.string().length(11).required().messages({
        'string.length': 'O campo cpf deve ter 11 caracteres',
        'string.empty': 'O campo cpf não pode estar vazio',
        'any.required': 'O campo cpf é obrigatório',
        'string.base': 'O campo cpf deve ser um texto',
    }),
    cep: joi.string().length(8).messages({
        'string.length': 'O campo cep deve ter 8 caracteres',
        'string.base': 'O campo cpf deve ser um texto',
    }),
    numero: joi.number().integer().messages({
        'number.base': 'O campo numero deve ser um número inteiro',
    }),
    rua: joi.string().messages({
        'string.base': 'O campo rua deve ser um texto',
    }),
    bairro: joi.string().messages({
        'string.base': 'O campo bairro deve ser um texto',
    }),
    cidade: joi.string().messages({
        'string.base': 'O campo cidade deve ser um texto',
    }),
    estado: joi.string().length(2).messages({
        'string.length': 'O campo estado deve ter 2 caracteres',
        'string.base': 'O campo estado deve ser um texto',
    }),

});

module.exports = schemaCliente;