
# Routes

| Method | URL              | Body                  | Response    | Description                                                 |
| ------ | ---------------- | --------------------- | ----------- | ----------------------------------------------------------- |
| GET    | /                | -                     | Array<Todo> | Listar todos os todos do usuário                            |
| POST   | /                | TodoEditable          | Todo        | Cria um todo não finalizado de acordo com os dados passados |
| PATCH  | /:todo_id        | Partial<TodoEditable> | Todo        | Atualiza o Todo de acordo com os novos valores passados     |
| POST   | /:todo_id/finish | Partial<TodoEditable> | Todo        | Finaliza o Todo                                             |

# Middlewares

Nenhum Middleware nesse controller

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

## Todo

| Field       | Type             | Description                            |
| ----------- | ---------------- | -------------------------------------- |
| id          | Int              | Identificação do Todo                  |
| description | String           | Descrição disponibilizada pelo usuário |
| deadline    | DateTime \| null | Prazo final ( Optional )               |
| createdAt   | DateTime         | Data de criação                        |
| updatedAt   | DateTime         | Data da última atualização             |
| finishedAt  | DateTime \| null | Data da finalização                    |
| userId      | Int              | Identificação do usuário               |
