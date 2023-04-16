const { Router } = require('express');
const { listarCategorias } = require('../controladores/categorias');
const rotaUsuario = require('../controladores/usuarios');
validarRequisicao = require('../intermediarios/validarcorporequisicao');
const schemaUsuario = require('../validacoes/schemausuario');
const schemalogin = require('../validacoes/schemalogin');
const autenticacao = require('../intermediarios/autenticacao');

const router = Router();

router.get('/', (req, res) => { res.send(
    '<h1>Bem vindo a API do desafio Final</h1>' +                                                                                              
    '<h2>Para acessar a documentação da API acesse o link: <a href="https://cute-colt-gabardine.cyclic.app/api-docs">https://cute-colt-gabardine.cyclic.app/api-docs</a></h2>'
    ); });

router.get('/categoria', listarCategorias);

router.post('/usuario', validarRequisicao(schemaUsuario), rotaUsuario.cadastrarUsuario);

router.post('/login', validarRequisicao(schemalogin), rotaUsuario.loginUsuario);

router.get('/usuario',autenticacao, rotaUsuario.detalharUsuario);

router.put('/usuario',validarRequisicao(schemaUsuario), autenticacao, rotaUsuario.atualizarUsuario);


module.exports = router;