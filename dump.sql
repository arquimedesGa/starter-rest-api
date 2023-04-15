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