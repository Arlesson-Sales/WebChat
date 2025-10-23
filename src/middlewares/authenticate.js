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
    const token = request.cookies.auth_token;
    if (!token) return response.status(400).redirect("/forms");

    try
    {
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