const knex = require('../conexao');
const transportador = require('../email/email');

const pedidos = {
    async cadastrarPedido(req, res) { 
        const {cliente_id, pedido_produtos} = req.body;
        try {
            const validarCliente = await knex('clientes').where({id: cliente_id});
            if(!validarCliente) {
                return res.status(404).json({Mensagem : 'Cliente não encontrado'});
            };
        const produto = await knex('produtos').whereIn('id', pedido_produtos.map(produto => produto.produto_id));
            console.log(produto);
        const validarIDproduto = produto.map(produto=> {
            if (produto.id !== produto.produto_id) {
                return true;
            };
        });
       
        if(validarIDproduto.length !== pedido_produtos.length) {
            return res.status(404).json({Mensagem : 'Produto não encontrado'});
        };

        const validarProdutoEstoque =  produto.every 

       console.log(validarProdutoEstoque);

        if(!validarProdutoEstoque) {
            return res.status(404).json({Mensagem : 'Quantidade solicitada fora de estoque'});
        };

        } catch (error) {
            return res.status(400).json(error.message);
        }
    }
}

module.exports = pedidos;