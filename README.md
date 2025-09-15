# Book Catalog API

Esta API permite gerenciar um catálogo de livros. Os usuários podem:

- **Obter todos os livros**
- **Buscar livros por nome**
- **Deletar livros**
- **Atualizar informações de livros**
- **Filtrar livros por status**

## 🔐 Autenticação

A API é protegida por autenticação. Usuários devem estar autenticados para acessar os endpoints.

## 📦 Endpoints

- `GET /books` – Retorna todos os livros
- `GET /books?name=nomeDoLivro` – Busca livros pelo nome
- `POST /books` – Cria um novo livro
- `PUT /books/:id` – Atualiza um livro existente
- `DELETE /books/:id` – Deleta um livro
- `GET /books?status=disponivel` – Filtra livros por status

## ⚙️ Tecnologias Utilizadas

- **NestJS** – Framework para construção de aplicações Node.js eficientes e escaláveis
- **Prisma** – ORM para interação com o banco de dados
- **JWT** – Autenticação baseada em tokens
- **Jest** – Framework de testes
- **Prettier & ESLint** – Ferramentas para formatação e linting de código
