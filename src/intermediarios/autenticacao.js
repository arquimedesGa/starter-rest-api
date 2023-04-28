const jwt = require("jsonwebtoken");

const knex = require("../conexao");

const verificarUsuarioLogado = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ mensagem: "Usuário não autorizado" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, process.env.SECRETJWT);

    const usuario = await knex("usuarios").where({ id });

    if (!usuario) {
      return res.status(401).json({ mensagem: "Não encontrado" });
    }
    
    req.usuario = usuario[0];

    next();
  } catch (error) {
    
    if (error.message === "jwt must be provided" || error.message === "invalid token" || error.message === "jwt malformed" || error.message === "jwt expired" || error.message === "invalid signature") {
        return res.status(401).json({ mensagem: "Não autorizado" });
    }

    return res.status(500).json({ mensagem: error.message });
    
  };
};
module.exports = verificarUsuarioLogado;
