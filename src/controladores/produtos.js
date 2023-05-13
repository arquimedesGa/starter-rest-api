const knex = require('../conexao');
const s3 = require('../utils/aws');

const rotaProdutos = {
    async cadastrarProduto(req, res) {
        const { descricao, quantidade_estoque, valor, categoria_id, produto_imagem } = req.body;
    
        try {
            
            const categoria = await knex('categorias').where({ id: categoria_id }).first();
            
            if (!categoria) {
                return res.status(404).json({messagem: 'Categoria não encontrada'});
            };

            const produto = await knex('produtos').insert({ descricao, quantidade_estoque, valor, categoria_id, produto_imagem }).returning('*');

            return res.status(201).json(produto);

        } catch (error) {
            return res.status(500).json(error.message);
        };

    },

    async atualizarProduto(req, res) {
        const { id } = req.params;
        let { descricao, quantidade_estoque, valor, categoria_id, produto_imagem } = req.body;
 
        try {
            const produto = await knex('produtos').where({ id }).first();

            if (!produto) {
                return res.status(404).json({messagem: 'Produto não encontrado'});
                
            };

            const categoria = await knex('categorias').where({ id: categoria_id }).first();
            
            if (!categoria) {
                return res.status(404).json({messagem: 'Categoria não encontrada'});
            };


            if (produto_imagem !== produto.produto_imagem) {
                if (produto.produto_imagem) { 
                    let separandoImagem = produto.produto_imagem.split('/');

                    let pathImagem = separandoImagem[separandoImagem.length - 1].toString();

                    s3.deleteObject({
                        Bucket: process.env.BUCKET_NAME,
                        Key: pathImagem
                        }).promise();
        
                };
                if (!produto_imagem) {
                    produto_imagem = null;
                }
                
            };

            const atualizarProduto = await knex('produtos').where({ id }).update({ descricao, quantidade_estoque, valor, categoria_id, produto_imagem}).returning('*');

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
                return res.status(400).json({messagem: 'Produto não encontrado'});
            };


            const pedido = await knex('pedido_produtos').where({ produto_id: id });

        
            if (pedido.length > 0) {
                return res.status(400).json({messagem: 'Não é possível excluir um produto que está em um pedido'});
            }
           
            if (produto.produto_imagem) { 
                let separandoImagem = produto.produto_imagem.split('/');

                let pathImagem = separandoImagem[separandoImagem.length - 1].toString();

                s3.deleteObject({
                    Bucket: process.env.BUCKET_NAME,
                    Key: pathImagem
                }).promise();
        
            };
                
            const deletarProduto = await knex('produtos').where({ id }).del();

            if (!deletarProduto) {
                return res.status(400).json({messagem: 'Não foi possível deletar o produto'});
            };

            return res.status(200).json({messagem: 'Produto deletado com sucesso'});

        } catch (error) {
            return res.status(500).json(error.message);
        };
    },

    async uploadArquivo(req, res) {
        const { file } = req

        try {

            if(!file) {
                return res.status(400).json({messagem: 'Arquivo não encontrado'});
            };

            const arquivo = await s3.upload({
                Bucket: process.env.BUCKET_NAME,
                Key: `${Date.now()}-${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype,

            }).promise();
            return res.status(200).json({url : arquivo.Location,
                nome: arquivo.Key,});
        } catch (error) {
            return res.status(500).json(error.message);
        };

    },

    async listarArquivos(req, res) {
        try {
            const arquivo = await s3.listObjects({ Bucket: process.env.BUCKET_NAME }).promise();

            const arquivos = arquivo.Contents.map(arquivo => {
                return {
                    url: `https://${process.env.BUCKET_NAME}.s3.us-east-005.backblazeb2.com/${arquivo.Key}`,
                    diretório: arquivo.Key
                }
            });
            return res.status(200).json(arquivos);
        } catch (error) {
            return res.status(500).json(error.message);
        };

    }

};

module.exports = rotaProdutos;