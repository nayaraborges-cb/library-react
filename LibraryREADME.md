# Sem título

# Library-API

## Visão Geral

Principais funcionalidades previstas:

- Cadastro e busca de livros
- Cadastro e gestão de usuários, com acesso restrito a administradores
- Autenticação e autorização com **JWT** e *roles* (admin, usuário padrão)
- Upload de arquivos (capa do livro e foto de perfil do usuário)
- Geração de relatórios em **PDF** com dados de livros

O backend está integrado a banco de dados **PostgreSQL**, com modelagem para entidades **User** e **Book**, e uso de **migrations** via Sequelize.

## Stack Técnica

### Frontend

- React
- Ant Design (componentes de UI)
- Formik (formulários e gerenciamento de estado)
- Yup (validação de dados)

### Backend

- Nest.js
- Sequelize (ORM)
- PostgreSQL
- Autenticação via JWT
- Armazenamento de arquivos em S3 compatível (**MinIO**)
- Redis para cache / sessão / *throttling*

### Infra / Outros

- *Throttling* de rotas (limite de 10 requisições por minuto) utilizando Redis

## Funcionalidades Implementadas

### Autenticação e autorização

- Login com JWT no backend
- Rotas protegidas com *Guards* e uso de *roles* (`ADMIN`, `USER`)

### Gestão de usuários

- Cadastro de usuários (restrito a admin)
- Senha armazenada com hash
- Modelagem para upload de avatar (S3/MinIO)

### Gestão de livros

- CRUD básico de livros
- Listagem com paginação
- Busca e detalhes de livro

### Requisitos não funcionais

- Organização em módulos (`users`, `books`, `auth` etc.)
- Separação em camadas (`controllers`, `services`, `repositories`, `DTOs`)
- Migrations com Sequelize
- DTOs para validação e padronização de respostas

## Estado Atual do Projeto

### Backend

- API, integração com banco de dados e autenticação estão implementadas e em funcionamento.
- A funcionalidade de geração de PDF já está modelada na API, porém ainda não foi completamente testada em ambiente integrado.

### Frontend

- Tela de login implementada e integrada à API.
- Parte do fluxo de navegação entre páginas ainda está em desenvolvimento (no momento, o roteamento está limitado principalmente à tela de login).

Esses pontos estão mapeados.

## Estrutura do Repositório

Projeto organizado em multirepo:

- **Backend**: [Repositório do backend](https://github.com/nayaraborges-cb/library-api)
- **Frontend**: [Repositório do frontend](https://github.com/nayaraborges-cb/library-react)