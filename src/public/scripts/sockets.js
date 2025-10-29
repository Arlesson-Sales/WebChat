/**
 * Essa função faz o processamento de todos os cookies visiveis ao javascript, retornando um objeto com todos eles.
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
 * Faz o retorno do tempo atual no formato HH:MM.
 * @returns {string}
 */
function getTimestamp()
{
    const date = new Date();
    const hours = date.getHours();
    const minuts = date.getMinutes();
    return `${hours < 10 ? "0" + hours : hours}:${minuts < 10 ? "0" + minuts : minuts}`;
}

/**
 * Obtem a referência as o inputs de mensagem, faz a validação da mensagem do usuário e a envia para o servidor com as informações como nome, hora e conteúdo.
 * @param {string} name Nome do usuário logado.
 * @param {object} socket Referência ao objeto de socket.
 */
function sendMessage(name, socket)
{
    const text_input = document.querySelector("#chat-message-content-input");
    const message = text_input.value;

    if (message.length > 0)
    {
        const message_data = { name, message, timestamp: getTimestamp() };
        appendMessage(message_data, "right-message");
        socket.emit("send-message", message_data);
        text_input.value = "";
    }
}

/**
 * Funcção responsavel por carregar os eventos de envio de mensagem.
 * @param {string} name Nome do usuário logado.
 * @param {object} socket Referência ao objeto de socket.
 */
function loadMessageEvent(name, socket)
{
    const button_input = document.querySelector("#chat-send-message-button");
    const text_input = document.querySelector("#chat-message-content-input");

    button_input.addEventListener("click", () => sendMessage(name, socket));
    text_input.addEventListener("keydown", ({ key }) => { if (key === "Enter") sendMessage(name, socket)});
}

/**
 * Evento que recebe a mensagem vinda do servidor e a processa para ser exibida no documento HTML.
 * @param {object} data Referência ao objeto contendo nome de usuário e a mensagem.
 * @param {string} message_direction Indica a posição da mensagem.
 */
function appendMessage(data, message_direction = "left-message")
{
    const chat_body = document.querySelector(".chat-container-body");
    const message_container = document.createElement("div");
    const message_content = document.createElement("p");
    const message_data = document.createElement("p");

    if (data?.type === "notification") //Caso a mensagem seja do tipo notificação sera exibindo que fulano entrou no chat
    {
        const message = document.createElement("div");
        message.classList.add("notification-message");
        message.innerHTML = `<p>${data.message}</p>`
        chat_body.appendChild(message);
        chat_body.scrollTo({ top: chat_body.scrollHeight, behavior: "smooth" });
        return;
    }

    message_container.classList.add("default-message");
    message_container.classList.add(message_direction);
    message_content.classList.add("message-content");
    message_data.classList.add("message-data");
    
    //Adição do timestamp da mensagem caso ele exista
    message_container.appendChild(message_data);
    message_data.innerText = `${data.name} ${data.timestamp}`;
    //Adição do conteudo da mensagem
    message_content.innerText = data.message;
    message_container.appendChild(message_content);

    chat_body.appendChild(message_container);
    chat_body.scrollTo({ top: chat_body.scrollHeight, behavior: "smooth" });
}

/** Evento para realiza o carregamento de todos os dados e outros eventos importantes para o funcionamento do script. */
window.addEventListener("load", () => {
    const socket = io();
    const cookies = loadCookies();

    loadMessageEvent(cookies.user_name, socket);
    //Definição de eventos do socket.
    socket.emit("new-user", { name: cookies.user_name });
    socket.on("send-message", appendMessage);
    socket.on("disconnect", () => socket.emit("user-disconnect", cookies.user_name));
});