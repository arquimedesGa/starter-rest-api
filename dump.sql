create database pdv
;

create table usuarios (
id serial primary key,
nome text not null,
email text unique,
senha text not null
);

create table categorias (
id serial primary key,
descricao text not null
);

insert into categorias (descricao)
values ('Informatica'), ('Celulares'), ('Beleza e Perfumaria'), 
('Mercado'), ('Livros e Papelaria'),
('Brinquedos'), ('Moda'), ('Bebe'), ('Games');

select * from categorias;

create table produtos (
id serial primary key,
descricao text not null,
quantidade_estoque integer,
valor integer,
categoria_id integer not null references categorias(id)
);

create table clientes (
id serial primary key,
nome text not null,
email text unique not null,
cpf integer unique not null,
cep integer,
rua text,
numero integer,
bairro text,
cidade text,
estado text
);

create table pedidos (
id serial primary key, 
cliente_id integer not null references clientes(id),
observacao text,
 valor_total integer not null
);


create table pedido_produtos(
id serial primary key,
pedido_id integer not null references pedidos(id),
produto_id integer not null references produtos(id),
quantidade_produto integer not null,
valor_produto integer not null
);

alter table produtos add column produto_imagem text;