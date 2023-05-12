const knex = require('../conexao');

const rotaProdutos = {
    async cadastrarProduto(req, res) {
        const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

        try {
            
            const categoria = await knex('categorias').where({ id: categoria_id }).first();
            
            if (!categoria) {
                return res.status(404).json({messagem: 'Categoria não encontrada'});
            };

            const produto = await knex('produtos').insert({ descricao, quantidade_estoque, valor, categoria_id }).returning('*');

            return res.status(201).json(produto);

        } catch (error) {
            return res.status(500).json(error.message);
        };

    },

    async atualizarProduto(req, res) {
        const { id } = req.params;
        const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
 
        try {
            const produto = await knex('produtos').where({ id }).first();

            if (!produto) {
                return res.status(404).json({messagem: 'Produto não encontrado'});
                
            };

            const categoria = await knex('categorias').where({ id: categoria_id }).first();
            
            if (!categoria) {
                return res.status(404).json({messagem: 'Categoria não encontrada'});
            };

            const atualizarProduto = await knex('produtos').where({ id }).update({ descricao, quantidade_estoque, valor, categoria_id }).returning('*');

            if (!atualizarProduto) {
                return res.status(400).json({messagem: 'Não foi possível atualizar o produto'});
            };

            return res.status(200).json(atualizarProduto[0]);

        } catch (error) {
            return res.status(500).json(error.message);
        };
    },

    async listarProdutos(req, res) {
        const {categoria_id} = req.query;

        try {
            if(!categoria_id) {
                const produtos = await knex('produtos');
                return res.status(200).json(produtos);
            };

            const produtos = await knex('produtos').where({categoria_id});

            return res.status(200).json(produtos);

            
        } catch (error) {
            return res.status(500).json(error.message);
        }
    },

    async detalharProduto(req, res) {
        const { id } = req.params;

        try {
            const produto = await knex('produtos').where({ id }).first();

            if (!produto) {
                return res.status(404).json({messagem: 'Produto não encontrado'});
            };

            return res.status(200).json(produto);

        } catch (error) {
            return res.status(500).json(error.message);
        };
    },

    async deletarProduto(req, res) {

        const { id } = req.params;

        try {
            const produto = await knex('produtos').where({ id }).first();

            if (!produto) {
                return res.status(404).json({messagem: 'Produto não encontrado'});
            };


            const pedido = await knex('pedido_produtos').where({ produto_id: id });

        
            if (pedido.length > 0) {
                return res.status(400).json({messagem: 'Não é possível excluir um produto que está em um pedido'});
            }

            const deletarProduto = await knex('produtos').where({ id }).del();

            if (!deletarProduto) {
                return res.status(400).json({messagem: 'Não foi possível deletar o produto'});
            };

            return res.status(200).json({messagem: 'Produto deletado com sucesso'});

        } catch (error) {
            return res.status(500).json(error.message);
        };
    }

};

module.exports = rotaProdutos;