import usersController from "./controllers/UsersController.js";

/** Evento de conexão que ocorre quando o um novo usuário acaba de logar. Ele recebe o nome do mesmo e o coloca dentro da lista de usuário online. */
function userConnection(io, socket, user)
{
    if (!usersController.online.has(user.name))
    {
        const message = { name: "", message: `${user.name} entrou no chat.`, type: "notification" };
        io.emit("send-message", message);
        console.log(`> O usuário ${user.name} logou no chat | socket ${socket.id}`);
    }
}

/** Evento qu ocorre quando o usuário se desconecta, e seu nome é removido da lista de onlines. */
function userDisconnect(user_name)
{
    usersController.online.delete(user_name);
}

/** Evento para validar a mensagem enviada pelo cliente e a exibir em todos os sockets conectados, além de armazenar a mesma nos logs. */
function sendMessageToClient(io, socket, message)
{
    socket.broadcast.emit("send-message", message);
}

/** Evento padrão de desconexão do socket. */
function socketDisconnect(socket, reason)
{
    usersController.online.delete(socket.user.name);
    console.log(`> O socket ${socket.id} foi desconectado pelo motivo: ${reason}`);
}

/** Função principal para realizar a definição */
export default function socketEvents(io)
{
    io.on("connection", socket => {
        socket.on("new-user", user_data => userConnection(io, socket, user_data));
        socket.on("send-message", message => sendMessageToClient(io, socket, message));
        socket.on("disconnect", reason => socketDisconnect(socket, reason));
        socket.on("user-disconnect", userDisconnect);
    });
}