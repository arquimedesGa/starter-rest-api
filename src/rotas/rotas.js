const { Router } = require('express');
const { listarCategorias } = require('../controladores/categorias');
const rotaUsuario = require('../controladores/usuarios');
const schemaUsuario = require('../validacoes/schemausuario');
const schemalogin = require('../validacoes/schemalogin');
const schemaproduto = require('../validacoes/schemaproduto');
const schemacliente = require('../validacoes/schemacliente');
const autenticacao = require('../intermediarios/autenticacao');
const validarRequisicao = require('../intermediarios/validarcorporequisicao');
const rotaProdutos = require('../controladores/produtos');
const rotaClientes = require('../controladores/clientes');
const rotaPedidos = require('../controladores/pedidos');


const router = Router();

router.get('/', (req, res) => { res.send(
    '<h1>Bem vindo a API do desafio Final</h1>' +                                                                                              
    '<h2>Para acessar a documentação da API acesse o link: <a href="https://cute-colt-gabardine.cyclic.app/api-docs">https://cute-colt-gabardine.cyclic.app/api-docs</a></h2>'
    ); });

router.get('/categoria', listarCategorias);

router.post('/usuario',validarRequisicao(schemaUsuario), rotaUsuario.cadastrarUsuario);

router.post('/login', validarRequisicao(schemalogin), rotaUsuario.loginUsuario);

router.get('/usuario', autenticacao, rotaUsuario.detalharUsuario);

router.put('/usuario', autenticacao, validarRequisicao(schemaUsuario), rotaUsuario.atualizarUsuario);

router.post('/produto', autenticacao, validarRequisicao(schemaproduto), rotaProdutos.cadastrarProduto);

router.put('/produto/:id', autenticacao, validarRequisicao(schemaproduto), rotaProdutos.atualizarProduto);

router.get('/produto/', autenticacao, rotaProdutos.listarProdutos);

router.get('/produto/:id', autenticacao, rotaProdutos.detalharProduto);

router.delete('/produto/:id', autenticacao, rotaProdutos.deletarProduto);

router.post('/cliente', autenticacao, validarRequisicao(schemacliente), rotaClientes.cadastrarCliente);

router.put('/cliente/:id', autenticacao, validarRequisicao(schemacliente), rotaClientes.editarDadosClientes);

router.get('/cliente/', autenticacao, rotaClientes.listarClientes);

router.get('/cliente/:id', autenticacao, rotaClientes.detalharCliente);

//esse controlador não foi feito ele vai estar no controlador de pedidos na pasta de controladores

router.post('/pedido', autenticacao, rotaPedidos.cadastrarPedido);

//esse controlador não foi feito ele vai estar no controlador de pedidos na pasta de controladores

router.get('/pedido', autenticacao, );

//esse controlador não foi feito ele vai estar no controlador de upload de arquivo na pasta de controladores

router.post('/arquivo/upload', autenticacao, );

//esse controlador não foi feito ele vai estar no controlador de upload de arquivo na pasta de controladores

router.get('/arquivo/', autenticacao, );


module.exports = router;