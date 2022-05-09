
# Objetivo do projeto

O Objetivo desse projeto é completar o desafio proposto em (Ubistart/nodejs-backend-challenge)[https://github.com/Ubistart/nodejs-backend-challenge?msclkid=e3f8974bcf4011ec91e39e0c39ebb695].

# Como iniciar

## Primeiros Passos

Primeiro, rode na pasta do projeto o comando `npm install` para que todas as dependências sejam atualizadas, e após isso configure o banco de dados

## Banco de dados

Com Docker: Pra rodar como docker, use o comando `docker compose -f docker-compose.database.yml up` e o banco de dados estará disponível.

Sem Docker: Realize a instalação do MySQL em seu computador e altere as configurações em .env e .env.test

Você pode também rodar o comando `npx prisma db push` para ter a estrutura do banco de dados no seu banco.

## Aplicação

Com Docker: Pra rodar como docker, use o comando `docker compose -f docker-compose.yml up` e você verá a aplicação rodando no console e/ou no próprio [navegador](https://localhost:8080/hello)

Sem Docker: Use o comando `npm run watch` e você verá a aplicação rodando no console e/ou no próprio [navegador](https://localhost:8080/hello)

## Testes

Com Docker: Pra rodar como docker, use o comando `docker compose -f docker-compose.test.yml up --build` e você verá o resultado do teste no seu terminal

Sem Docker: Use o comando `npm run test` e assim que terminarem os testes você poderá ver os resultados

# Serviços disponibilizados na Aplicação

| Serviço                                                             | Descrição                                                             |
| ------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [HelloController](src/controllers/HelloController/documentation.md) | Dispobilizar uma forma de testar rapidamente se o serviço está online |
| [AuthController](src/controllers/AuthController/documentation.md)   | Login e middlewares de autenticação                                   |

# Authors

(Leonardo Zivieri)[https://www.linkedin.com/in/leonardo-zivieri/]
