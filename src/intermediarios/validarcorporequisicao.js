const validarRequisicao = joiSchema => (req, res, next) => {

    try {
        
    const { error } = joiSchema.validate(req.body);

    if (error) {
     return res.status(400).json({mensagem : `${error.details[0].message}`});
     };

    next();

    } catch (error) {
        return res.status(500).json(error.message);
    }
};

module.exports = validarRequisicao;