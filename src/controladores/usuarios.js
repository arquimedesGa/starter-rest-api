const knex = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const rotaUsuario = {
  async cadastrarUsuario(req, res) {
    const { nome, email, senha } = req.body;
    try {
      const criptografiSenha = await bcrypt.hash(senha, 10);
      const usuarioCadastrado = await knex("usuarios").insert({ nome, email, senha: criptografiSenha }).returning("*");

      const usuarioSemSenha = {
        id: usuarioCadastrado[0].id,
        nome: usuarioCadastrado[0].nome,
        email: usuarioCadastrado[0].email,
      };

      return res.status(201).send();
    } catch (error) {
      if(error.constraint) {
        return res.status(409).json({Mensagem : "Usuário já cadastrado"})
      } else {
        return res.status(500).json(error.message);
      };
    };
  },

  async loginUsuario(req, res) {
    const { email, senha } = req.body;

    try {
      const consultaUSuario = await knex("usuarios").select('*').where({ email });

      if (!consultaUSuario[0]) {
        return res.status(400).json({ mensagem: "usuario ou senha invalido" });
      }

      const validarLogin = await bcrypt.compare(
        senha,
        consultaUSuario[0].senha
      );

      if (!validarLogin) {
        return res.status(400).json({ mensagem: "usuario ou senha invalido" });
      }

      const token = jwt.sign(
        { id: consultaUSuario[0].id },
        process.env.SECRETJWT,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        usuario: {
          id: consultaUSuario[0].id,
          nome: consultaUSuario[0].nome,
          email,
        },
        token,
      });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  async detalharUsuario(req, res) {
    const { id } = req.usuario;
    try {
      const usuario = await knex("usuarios").select("*").where({ id });

      const usuarioSemSenha = {
        id: usuario[0].id,
        nome: usuario[0].nome,
        email: usuario[0].email,
      };
      return res.status(200).json(usuarioSemSenha);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  async atualizarUsuario(req, res) {
    const usuario = req.usuario;

    const { nome, email, senha } = req.body;

    try {
      const criptografiSenha = await bcrypt.hash(senha, 10);

      const alterandoUsuario = await knex("usuarios").update({ nome, email, senha: criptografiSenha }).where({ id: usuario.id });

      return res.status(200).send();
      
    } catch (error) {
      return res.status(500).json({
        mensagem:
          "O e-mail informado já está sendo utilizado por outro usuário.",
      });
    }
  },

};

module.exports = rotaUsuario;

