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