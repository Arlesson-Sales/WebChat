/** Essa função é chamada repetidamente para buscar os usuários online e fazer a exibição dos mesmo no menu lateral. */
async function displayOnlineUsers()
{
    const side_menu_list = document.querySelector(".side-menu > ul");
    const request = await window.fetch("./api/online");
    const online_users = await request.json();

    side_menu_list.innerHTML = "";
    for (const user_name of online_users)
    {
        side_menu_list.innerHTML += `
            <li>
                <div class="profile-circle">${user_name.slice(0, 2).toUpperCase()}</div>
                <p>${user_name}</p>
            </li>
        `;
    }
    window.setTimeout(displayOnlineUsers, 10000);
}

/** Função evento para fazer com que o meno lateral fique visivel ou não. */
function toggleSideMenu()
{
    const side_menu = document.querySelector(".side-menu");
    side_menu.classList.toggle("side-menu-actived");
}

window.addEventListener("load", () => {
    const menu_icon = document.querySelector("#header-side-menu-icon");
    menu_icon.addEventListener("click", toggleSideMenu);
    window.setTimeout(displayOnlineUsers, 1000);
});