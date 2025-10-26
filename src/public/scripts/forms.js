function eventToggleForm(button, buttons)
{
    buttons.forEach(element => element.classList.remove("actived-button"));
    button.classList.add("actived-button");

    const all_forms = document.querySelectorAll("form");
    const form_title = document.querySelector("#form-title");
    const form_target = document.querySelector(`#${button.value}`);
    const forms_messages = document.querySelectorAll(".form-red-message");

    form_title.innerText = button.value === "form-login" ? "Seja bem vindo" : "Crie sua conta";
    all_forms.forEach(form => form.style.display = "none");
    forms_messages.forEach(message => message.remove());
    form_target.style.display = "block";
}

/** Função que realiza o carregamento dos eventos de mudança de formulario. */
function loadFormToggleEvents()
{
    const buttons = document.querySelectorAll(".form-toggle-container > button");
    buttons.forEach(button => button.addEventListener("click", event => eventToggleForm(event.target, buttons)));
}

window.addEventListener("load", () => loadFormToggleEvents());