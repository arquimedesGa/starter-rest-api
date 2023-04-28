const knex = require('../conexao');

const rotaClientes = {
    async cadastrarCliente(req, res) {
        const { cpf, email } = req.body;

        try {
            const clienteCPF = await knex('clientes').where({ cpf }).first();

            if(clienteCPF) {
                return res.status(409).json('O CPF informado já foi cadastrado');
            };

            const clienteEmail = await knex('clientes').where({ email }).first();

            if(clienteEmail) {
                return res.status(409).json('O email informado já foi cadastrado');
            };

            Object.entries(req.body).map(([chave, valor]) => {
                if(!valor) {
                    delete req.body[chave];
                };
            });

            const cliente = await knex('clientes')
            .insert(req.body).returning('*');

            if(!cliente) {
                return res.status(400).json('O cliente não foi cadastrado.');
            };

            return res.status(200).json({mensagem : 'O cliente foi cadastrado com sucesso.'});

        } catch (error) {
            return res.status(500).json(error.message);
        };
    },

    async editarDadosClientes(req, res) {
        const { nome, cpf, email, telefone, cep, logradouro, numero, complemento, bairro, cidade, estado } = req.body;
        const {id} = req.params;

        try {
            const atualizarUsuario = await knex('clientes')
            .update({ nome, cpf, email, telefone, cep, logradouro, numero, complemento, bairro, cidade, estado })
            .where({ id });

             return res.status(200).json({mensagem : 'O cliente foi atualizado com sucesso.'});

        } catch (error) {
            if(error.message.includes('clientes_cpf_key')) {
                return res.status(409).json( {Mensagem : 'O CPF informado já foi cadastrado'});
            };
            if(error.message.includes('clientes_email_key')) {
                return res.status(409).json( {Mensagem : 'O email informado já foi cadastrado'});
            };
            return res.status(500).json(error.message);
        };    
    },

    async listarClientes(req, res) {
        try {
            const clientes = await knex('clientes').select('*');
            return res.status(200).json(clientes);

        } catch (error) {
            return res.status(500).json(error.message);
        };
            
    },

    async detalharCliente(req, res) {
        const { id } = req.params;

        try {
            const cliente = await knex('clientes').where({ id }).first();

            if(!cliente) {
                return res.status(400).json({mensagem: 'O cliente não foi encontrado.'});
            };

            return res.status(200).json(cliente);
            
        } catch (error) {
            return res.status(500).json(error.message);
        };
    }
};

module.exports = rotaClientes;