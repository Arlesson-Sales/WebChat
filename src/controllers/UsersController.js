import UserModel from "../schemas/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import http from "http";

class UsersController
{
    blacklist_tokens = new Set(); //Blacklist de tokens para serem deletados.
    online = new Map(); //Coleção para armazenar os usuários online.

    /**
     * Recebe como argumento um token de authenticação que foi gerado quando determinado usuário logou, fazendo com que o mesmo seja removido da lista de onlines.
     * @param {string} token Token de authenticação.
     */
    removeOnlineUser(token)
    {
        this.online.forEach((user_token, user_name) => {
            if (user_token === token)
                this.online.delete(user_name);
        });
    }

    /**
     * Recebe a senha que o usuário deseja cadastrar na criação de sua conta e faz a validação da mesma, retornando um objeto que indica se ela esta no padrão ou não junto com uma mensagem.
     * @param {string} password Senha do usuário.
     * @returns 
     */
    validatePassword(password)
    {
        if (!/[A-Za-z\d@$!%*?&]{8,}$/.test(password))
            return { is_ok: false, message: "A senha deve ter pelo menos 8 caracteres" };
        if (!/(?=.*[a-z])/.test(password))
            return { is_ok: false, message: "A senha deve conter letras minusculas." };
        if (!/(?=.*[A-Z])/.test(password))
            return { is_ok: false, message: "A senha deve conter letras maiusculas." };
        if (!/(?=.*\d)/.test(password))
            return { is_ok: false, message: "A senha deve possuir numeros" }

        return { is_ok: true, message: "A senha esta no padrão correto" };
    }

    ////////////////////////////////////////////////////////////////////////////
    /// MÉTODOS CONTROLADORES
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Método responsavel por fazer a criação, validação dos dados e cadastro de um novo usuário na aplicação.
     * @param {string} name Nome de usuário.
     * @param {string} password Senha do usuário.
     * @returns {Promise<object>}
     */
    async create(name, password)
    {
        if (await UserModel.findOne({ name })) //Validando nome.
            return { is_ok: false, status: 400, message: "Nome de usuário já está em uso", dest: "/forms" };
        
        //Realizando a validação da senha
        const validation = this.validatePassword(password);
        if (!validation.is_ok)
            return { is_ok: false, status: 400, message: validation.message, dest: "/forms" };

        //Criando hash
        const hash = await bcrypt.hash(password, 12);
        const user = await UserModel.create({ online: false, token: "", hash, name });
        
        console.log(`> Usuário ${name} cadastrado com sucesso!`);
        return { is_ok: true, status: 201, message: "Usuário cadastrado com sucesso", dest: "/home", user };
    }

    /**
     * Esse método verifica as informações do usuário que está tentando se autenticar e caso tudo ocorra bem é retornado um token de autenticação no objeto de retorno.
     * @param {string} name Nome do usuário cadastrado.
     * @param {string} password Senha do usuário cadastrado.
     * @returns {Promise<object>}
     */
    async authenticate(name, password)
    {
        const user = await UserModel.findOne({ name });
        if (user)
        {
            if (await bcrypt.compare(password, user.hash))
            {
                const payload = { name: user.name };
                const secret = process.env.JWT_SECRET || crypto.randomBytes(64).toString("hex");
                const token = jwt.sign(payload, secret, { expiresIn: "24h" });

                this.online.set(name, token); //Definindo que o usuário logado com esse token está online
                return { is_ok: true, status: 200, message: "Login efetuado com sucesso", dest: "/home", token, user };
            }
            return { is_ok: false, status: 401, message: "Senha incorreta", dest: "/forms" };
        }
        return { is_ok: false, status: 401, message: "Nome de usuário não existe", dest: "/forms" };
    }

    ////////////////////////////////////////////////////////////////////////////
    /// FUNÇÕES DE ROTAS
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Retorna o nome dos usuários online.
     * @param {http.ClientRequest} request Objeto de requisição do cliente.
     * @param {http.ServerResponse} response Objeto de resposta do servidor.
     */
    getOnline(request, response) {
        const online = [];
        this.online.forEach((token, name) => online.push(name));
        response.status(200).json(online);
    }

    /**
     * Função de rota que retorna um json com todos os usuários cadastrados.
     * @param {http.ClientRequest} request Objeto de requisição do cliente.
     * @param {http.ServerResponse} response Objeto de resposta do servidor.
     */
    async getAll(request, response) {
        try 
        {
            const data = await UserModel.find({});
            const users = data.map(({ _id, name, online }) => { return { _id, name, online }});
            response.status(200).json(users);
        }
        catch (erro)
        {
            console.log(erro);
            response.status(400).json({ message: erro.message });
        }
    }

    /**
     * Função de rota para realização do logout da aplicação.
     * @param {http.ClientRequest} request Objeto de requisição do cliente.
     * @param {http.ServerResponse} response Objeto de resposta do servidor.
     */
    async logout(request, response)
    {
        try
        {
            const token = request.cookies.auth_token;
            this.removeOnlineUser(token);
            this.blacklist_tokens.add(token);
            response.status(200).redirect("/");
        }
        catch (erro)
        {
            console.log("> Erro durante o processo de logout.");
            response.status(400).redirect("/");
        }
    }

    /**
     * Função de rota para realização de login de um usuário já cadastrado.
     * @param {http.ClientRequest} request Objeto de requisição do cliente.
     * @param {http.ServerResponse} response Objeto de resposta do servidor.
     */
    async login(request, response)
    {
        try
        {
            const { name, password } = request.body;
            const result = await this.authenticate(name, password);
    
            //Criação do token de login
            if (result.is_ok)
                response.cookie("auth_token", result.token, { httpOnly: true, sameSite: "Lax" });
            response.status(result.status).redirect(`${result.dest}?message=${result.message}`);
        }
        catch(erro)
        {
            console.log(`> Erro durante o processo de login: ${erro.message}`);
            response.status(400).redirect("/");
        }
    }

    /**
     * Função de rota para realizar o cadastro de novos usuários na aplicação.
     * @param {http.ClientRequest} request Objeto de requisição do cliente.
     * @param {http.ServerResponse} response Objeto de resposta do servidor.
     */
    async registration(request, response)
    {
        try
        {
            const { name, password } = request.body;
            const result = await this.create(name, password);
            response.status(result.status).redirect(`${result.dest}?message=${result.message}`);
        }
        catch (erro)
        {
            console.log(`> Erro ao registrar novo usuário: ${erro.message}`);
            response.status(400).redirect("/");
        }
    }
}

export default new UsersController();