/**
 * Quando chamada essa função faz o processamento e retorna um objeto contendo todos os cookies como propriedades.
 * @returns {object}
 */
function loadCookies()
{
    const data = document.cookie.split(";");
    const cookies = {};

    for (const cookie of data)
    {
        const [ name, value ] = cookie.split("=");
        cookies[name.trim()] = decodeURIComponent(value);
    }
    return cookies;
}

/**
 * Faz o carregamento do evento responsavel pelo envio da mensgame para o servidor.
 * @param {string} name Nome do usuário.
 * @param {object} socket Referência ao objeto de socket.
 */
function loadMessageEvent(name, socket)
{
    const text_input = document.querySelector("#chat-text-input");
    const button_input = document.querySelector("#chat-button");

    button_input.addEventListener("click", () => {
        const message = text_input.value;

        if (message.length > 0)
        {
            socket.emit("send-message", { name, message });
            text_input.value = "";
        }
    })
}

/**
 * Evento que recebe a mensagem vinda do servidor e a processa para ser exibida no documento HTML.
 * @param {object} data Referência ao objeto contendo nome de usuário e a mensagem.
 */
function sendMessage(data)
{
    const chat_body = document.querySelector(".chat-body");
    const message_element = document.createElement("p");
    const name_element = document.createElement("span");

    if (data.name)
    {
        name_element.innerText = data.name;
        message_element.appendChild(name_element);
        message_element.innerText += ": ";
    }

    message_element.innerText += `${data.message}`;
    chat_body.appendChild(message_element);
}

/**  Faz a inicialização de todos os eventos nescessario. */
window.addEventListener("load", () => {
    const socket = io();
    const cookies = loadCookies();

    loadMessageEvent(cookies.user_name, socket);
    socket.emit("new-user", { name: cookies.user_name });
    socket.on("send-message", sendMessage);
    socket.on("disconnect", () => socket.emit("user-disconnect", cookies.user_name));
});