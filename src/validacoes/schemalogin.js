const joi = require('joi');

const schemaLogin = joi.object({
    senha: joi.string().required().messages({
        'string.empty': 'O campo senha não pode estar vazio',
        'any.required': 'O campo senha é obrigatório',
    }),
    email: joi.string().email().required().messages({
        'string.email': 'O campo email deve ser um email válido',
        'string.empty': 'O campo email não pode estar vazio',
        'any.required': 'O campo email é obrigatório',
    })
});

module.exports = schemaLogin;