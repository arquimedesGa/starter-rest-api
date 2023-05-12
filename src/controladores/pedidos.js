const knex = require('../conexao');
const transportador = require('../email/email');
const compiladorHtml = require('../utils/compiladorhtml');

const pedidos = {
    async cadastrarPedido(req, res) { 
        const {cliente_id, observacao, pedido_produtos} = req.body;
        const {usuario} = req;

        try {
            const validarCliente = await knex('clientes').where({id: cliente_id});

            if(!validarCliente[0]) {
                return res.status(400).json({Mensagem : 'Cliente não encontrado'});
            };

            const produto = await knex('produtos').whereIn('id', pedido_produtos.map(produto => produto.produto_id));
            
            let idsProdutos = [];

            let quantidadeProdutos = [];

            pedido_produtos.map(produtoBody => {
                const produtoEncontrado = produto.find(produto => produto.id === produtoBody.produto_id);

                if(!produtoEncontrado) {
                    idsProdutos.push({ id : produtoBody.produto_id});
                };

            });
        
            if(idsProdutos.length > 0) {
                return res.status(400).json({Mensagem : 'Produto não encontrado' , Ids : idsProdutos});
            }; 

            pedido_produtos.map(produtobody => {
                const produtoEncontrado = produto.find(produto => produto.id === produtobody.produto_id);
                if(produtoEncontrado.valor){
                    produtobody.valor = produtoEncontrado.valor;
                }
                if(produtoEncontrado.quantidade_estoque < produtobody.quantidade_produto) {
                    quantidadeProdutos.push({ id : produtobody.produto_id});

                };

            });

            if(quantidadeProdutos.length > 0) {
                return res.status(400).json({Mensagem : 'Quantidade solicitada fora de estoque', Ids : quantidadeProdutos});
            };
            
            const valorTotal = pedido_produtos.reduce((acc, produtobody) => {
                const produtoEncontrado = produto.find(produto => produto.id === produtobody.produto_id);
            
                return acc + produtoEncontrado.valor * produtobody.quantidade_produto;
                
            }
            , 0);

            const guardandoPedido = await knex('pedidos').insert({cliente_id, observacao, valor_total: valorTotal}).returning('*');

            await knex('pedido_produtos').insert(pedido_produtos.map(produtoBody => 
                ({pedido_id: guardandoPedido[0].id,
                 produto_id: produtoBody.produto_id,
                 quantidade_produto: produtoBody.quantidade_produto,
                 valor_produto: produtoBody.valor}))).returning('*');

            const html = await compiladorHtml('./src/templates/pedidofeito.html', {nome: usuario.nome, valor: valorTotal/100});

            transportador.sendMail({
                from: process.env.EMAIL_FROM,
                to: usuario.email,
                subject: "Pedido realizado com sucesso",
                html,
            });

            return res.status(200).json({Mensagem : 'Pedido cadastrado com sucesso'});

        } catch (error) {
            return res.status(500).json(error.message);
        };
    },

    async listarPedidos(req, res) {
        const {cliente_id} = req.query;

        try {

            if(cliente_id) {
                const pedidos = await knex('pedidos').where({cliente_id});

                if(!pedidos[0]) {
                    return res.status(404).json({Mensagem : 'Não há pedidos cadastrados, para este cliente'});
                };

                const pedidosComProdutos = await knex('pedido_produtos').whereIn('pedido_id', pedidos.map(pedido => pedido.id));

                const pedidosComProdutosFormatados = pedidos.map(pedido => {
                    const produtos = pedidosComProdutos.filter(pedidoProduto => pedidoProduto.pedido_id === pedido.id);
                    return {pedido : {...pedido, pedido_produtos: produtos}};
                });

                return res.status(200).json(pedidosComProdutosFormatados);
            }
            const pedidosSemId = await knex('pedidos');

            if(!pedidosSemId[0]) {
                return res.status(400).json({Mensagem : 'Não há pedidos cadastrados'});
            };

            const pedidosSemIdComProdutos = await knex('pedido_produtos').whereIn('pedido_id', pedidosSemId.map(pedido => pedido.id));

            const pedidosSemIdComProdutosFormatados = pedidosSemId.map(pedido => {
                const produtos = pedidosSemIdComProdutos.filter(pedidoProduto => pedidoProduto.pedido_id === pedido.id);
                return {pedido : {...pedido, pedido_produtos: produtos}};
            });

            return res.status(200).json(pedidosSemIdComProdutosFormatados);

        } catch (error) {
            return res.status(500).json(error.message);
        };
    }
}

module.exports = pedidos;