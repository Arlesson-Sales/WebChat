import usersController from "../controllers/UsersController.js";
import jwt from "jsonwebtoken";
import http from "http";

/**
 * Middleware de autenticação para saber que o usuário está logado.
 * @param {http.ClientRequest} request Objeto de requisição do cliente.
 * @param {http.ServerResponse} response Objeto de resposta do servidor.
 * @param {Function} next Função para chamar o próximo middleware.
 */
export function loginTokenAuth(request, response, next)
{
    try
    {
        const token = request.cookies.auth_token;
    
        if (!token || usersController.blacklist_tokens.has(token))
            return response.status(400).redirect("/forms");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = decoded;
        next();
    }
    catch(erro)
    {
        console.log(`> Erro durante a autenticação do token: ${erro.message}`);
        response.status(400).redirect("/forms");
    }
}

/**
 * Middleware de autenticação para verificar se o socket conectado percente a alguem logado.
 */
export function socketAuth(socket, next)
{
    try
    {
        const token = socket.handshake.headers.cookie.split("=")[1];

        if (!token || usersController.blacklist_tokens.has(token))
            return next(new Error("A autenticação é nescessaria"));
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
    }
    catch(erro) {
        return next(new Error("Erro durante a autenticação do token"));
    }
}