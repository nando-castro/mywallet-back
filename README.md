# My-Wallet-api
<h3 align="left">Tecnologias utilizadas:</h3>
<div align="left">
  <img align="center" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="javascript" />
  <img align="center" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="react" />
  <img align="center" src="https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white" alt="react" />
  <img align="center" src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="mongodb" />
</div>

# Description
​
My Wallet é uma aplicação para controle de gastos.
​
## Features
- Add a balance entry
- Add an out of balance
- Edit and Update your balance entries
- Delete entries
​
## API Reference
​
### Register User

```http
POST /sign-up
```

####  Request:
##### &nbsp; ‣ &nbsp; Body
  ```json
  {
    "name": "admin",
    "email": "dev@example.com"
    "password": "secret"
    "passwordConfirm": "secret"
  }
  ```
#### Response:
| Status Code |      Description      |          Properties           |
| :---------: | :-------------------: | :---------------------------: |
|   **201**   |          Created           |          CREATED           |
|   **422**   |     Unprocessable Entity     | `error: { message }` |
|   **500**   | Internal Server Error | `error: { message }` |
### Login User
```http
POST /sign-in
```
##### &nbsp; ‣ &nbsp; Body
```json
{
  "email": "dev@example.com",
  "password": "secret"
}
```
#### Response:
```json
 {
   "token": "token-api-generate"
   "email": "dev@example.com"
   "name": "admin"
 }
```

| Status Code |      Description      |          Properties           |
| :---------: | :-------------------: | :---------------------------: |
|   **200**   |          OK           |          OK           |
|   **404**   |       Not Found       | `error: { message }` |
|   **422**   |     Unprocessable Entity     | `error: { message }` |
|   **500**   | Internal Server Error | `error: { message }` |

​
### Get Finances
```http
GET /finances
```
##### &nbsp; ‣ &nbsp; Headers
```json
{
  "Authorization": "token",
}
```

#### Response:
```json
[
 {
   "_id": "id-generate-mongo"
   "value": number
   "descripition": string
   "type": string
   "date": string
   "userId": string
 }
]
```
​
## Environment Variables
​
To run this project, you will need to add the following environment variables to your .env file
​
`DATABASE_URL = postgres://UserName:Password@Hostname:5432/DatabaseName`
​
`PORT = number #recommended:5000`
​
`SECRET_KEY = any string`
​
## Run Locally
​
Clone the project
​
```bash
  git clone https://github.com/user/projeto18-valex
```
​
Go to the project directory
​
```bash
  cd projeto18-valex/
```
​
Install dependencies
​
```bash
  npm install
```
​
Create database
​
```bash
  cd src/db/dbConfig
```
```bash
  bash ./create-database
```
```bash
  cd ../../..
```
​
Start the server
​
```bash
  npm run start
```
​
