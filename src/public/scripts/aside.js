/** Essa função é chamada repetidamente para buscar os usuários online e fazer a exibição dos mesmo no menu lateral. */
async function displayOnlineUsers()
{
    const side_menu_list = document.querySelector(".side-menu > ul");
    const request = await window.fetch("http://localhost:8888/api/online");
    const online_users = await request.json();

    side_menu_list.innerHTML = "";
    for (const user_name of online_users)
        side_menu_list.innerHTML += `<li><div class="online-dot"></div>${user_name}</li>`
    window.setTimeout(displayOnlineUsers, 10000);
}

/** Função evento para fazer com que o meno lateral fique visivel ou não. */
function toggleSideMenu()
{
    if (window.screen.width < 840)
    {
        const side_menu = document.querySelector(".side-menu");
        side_menu.classList.toggle("side-menu-actived");
    }

}

window.addEventListener("load", () => {
    const menu_icon = document.querySelector("#header-side-menu-icon");
    menu_icon.addEventListener("click", toggleSideMenu);
    window.setTimeout(displayOnlineUsers, 1000);
});