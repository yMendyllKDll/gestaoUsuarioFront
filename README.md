# Gestão de Usuários

Este é um projeto de frontend para um sistema de gestão de usuários, desenvolvido com Angular.

## Requisitos

- Node.js (versão 14 ou superior)
- npm (versão 6 ou superior)
- Angular CLI (versão 14 ou superior)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/gestao-usuario-front.git
cd gestao-usuario-front
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
ng serve
```

4. Acesse a aplicação em `http://localhost:4200`

## Funcionalidades

- Login e registro de usuários
- Listagem de usuários
- Criação, edição e exclusão de usuários
- Listagem, criação, edição e exclusão de endereços
- Validação de formulários reativos
- Consumo de API REST

## Tecnologias Utilizadas

- Angular 14
- Bootstrap 5
- Bootstrap Icons
- RxJS
- TypeScript

## Organização dos Models

As interfaces e tipos TypeScript utilizados em toda a aplicação estão centralizados na pasta `src/app/models`, incluindo:
- User, Address, AddressDTO
- Pageable, PageResponse, Sort
- LoginRequest, RegisterRequest, DecodedToken

## Scripts Disponíveis

- `ng serve`: Inicia o servidor de desenvolvimento
- `ng build`: Compila o projeto para produção
