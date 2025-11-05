# 💬 WebChat — Node.js, Express, EJS e Socket.IO

Um sistema completo de **cadastro, login e chat global em tempo real**, onde apenas usuários autenticados podem acessar e conversar entre si. Desenvolvido com **Express**, **EJS** e **Socket.IO**, utilizando **MongoDB** para persistência e **JWT** para autenticação.

## 🚀 Tecnologias Utilizadas

- **Node.js** — ambiente de execução
- **Express** — framework backend
- **EJS** — motor de templates para renderização de páginas dinâmicas
- **Socket.IO** — comunicação em tempo real via WebSockets
- **Mongoose** — integração com banco MongoDB
- **JWT (jsonwebtoken)** — autenticação segura via tokens
- **Bcrypt** — hashing de senhas
- **Cookie-parser** — leitura e gerenciamento de cookies

## 📦 Funcionalidades

- 🔐 **Cadastro e login de usuários**
  - Validação de senha forte (mínimo 8 caracteres, letras maiúsculas, minúsculas e números)
  - Armazenamento de senhas com hash seguro (bcrypt)
  - Tokens JWT com expiração automática

- 🧠 **Sessões autenticadas**
  - Apenas usuários logados podem acessar o chat
  - Tokens validados no handshake do Socket.IO

- 💬 **Chat global em tempo real**
  - Todos os usuários logados podem enviar e receber mensagens instantaneamente
  - Sistema de lista de usuários online
  - Logout automático limpa o token e remove o usuário da lista de online

- 🗄️ **Banco de dados**
  - Usuários armazenados no MongoDB
  - Campos: nome, hash da senha, token e status online

## 🧩 Configuração e Execução

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/chat-global-login.git
cd chat-global-login
````

### 2. Instalar dependências

```bash
npm install
```

### 3. Criar arquivo `.env`

```env
PORT=3000
DATABASE_KEY=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<db>
JWT_SECRET=uma_chave_segura
ORIGIN=http://localhost:3000
```

### 4. Iniciar o servidor

```bash
npm start
```

## 💻 Demonstração

1. Acesse `/forms` para cadastrar ou logar.
2. Após o login, você será redirecionado para `/home`, onde o chat global está ativo.
3. Converse com qualquer usuário autenticado em tempo real.

## 🧠 Aprendizados

Este projeto demonstra:

* Como integrar **autenticação com JWT** em aplicações **Express**
* Como proteger **sockets** com **autenticação baseada em tokens**
* Uso combinado de **EJS + Socket.IO** para front-end dinâmico
* Boas práticas de **estrutura modular no Node.js**

## 🧑‍💻 Autor

**Arlesson**
Estudante de Programação • Desenvolvedor Node.js
📚 Foco em JavaScript, TypeScript e sistemas backend
🔗 [GitHub](https://github.com/Arlesson-sales)
