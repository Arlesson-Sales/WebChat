import jwt from "jsonwebtoken";

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
        console.log(`> Erro durante a autenticaçaõ do token: ${erro.message}`);
        response.status(400).redirect("/");
    }
}