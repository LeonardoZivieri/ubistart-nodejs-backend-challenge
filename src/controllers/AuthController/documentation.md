
# Routes

| Method | URL           | Body            | Response          | Description                                                         |
| ------ | ------------- | --------------- | ----------------- | ------------------------------------------------------------------- |
| POST   | register      | UserCredentials | AuthorizationData | Requisição para registrar um novo usuário                           |
| POST   | authenticate  | UserCredentials | AuthorizationData | Requisição para coletar tokens de acesso de um usuário já criado    |
| POST   | refresh-token | UserToken       | AuthorizationData | Requisição para coletar tokens de acesso a partir de um outro token |

# Middlewares

-- TODO: Listar todos os models e o que eles influenciam no app

# Models

## UserCredentials

| Field    | Type   | Description                                 |
| -------- | ------ | ------------------------------------------- |
| email    | string | Email de acesso que você usará na aplicação |
| password | string | Senha de acesso                             |

## AuthorizationData

| Field                | Description                                  |
| -------------------- | -------------------------------------------- |
| user                 | Informações do usuário que foi autenticado   |
| auth                 | Senha de acesso                              |
| auth.token           | Token para ser usado em requisições          |
| auth.expToken        | Tempo para que o token seja expirado em ms   |
| auth.refreshToken    | Token para utilizar ao solicitar outro token |
| auth.expRefreshToken | Tempo para o refresh token expirar em ms     |

## UserToken

| Field | Type   | Description      |
| ----- | ------ | ---------------- |
| token | string | Token de refresh |
