const joi = require('joi');

const schemaUsuario = joi.object({
    nome: joi.string().min(3).max(50).required().messages({
        'string.min': 'O campo nome deve ter no mínimo 3 caracteres',
        'string.max': 'O campo nome deve ter no máximo 50 caracteres',
        'string.empty': 'O campo nome não pode estar vazio',
        'any.required': 'O campo nome é obrigatório',
    }),
    email: joi.string().email().required().messages({
        'string.email': 'O campo email deve ser um email válido',
        'string.empty': 'O campo email não pode estar vazio',
        'any.required': 'O campo email é obrigatório',
    }),
    senha: joi.string().min(6).max(12).required().messages({
        'string.min': 'O campo senha deve ter no mínimo 6 caracteres',
        'string.max': 'O campo senha deve ter no máximo 12 caracteres',
        'string.empty': 'O campo senha não pode estar vazio',
        'any.required': 'O campo senha é obrigatório',
    }),
});

module.exports = schemaUsuario;