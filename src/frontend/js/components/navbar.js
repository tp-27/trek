const NavModule = {
    showMenu() {
        var menu = document.querySelector(".sidebar");
        menu.style.display = "block";
    },

    closeMenu() {
        var menu = document.querySelector(".sidebar");
        menu.style.display = "none";
    }
};