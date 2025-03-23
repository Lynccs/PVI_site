function toggleActiveClass(element, event, addClassName) {
    const targetElement = document.querySelector(element);

    if (!targetElement) return;
    const isActive = targetElement.classList.contains(addClassName);

    // шукає елемент, який або сам є тим, що відповідає селектору (наприклад, класу)
    // або є одним із його батьків
    if (event.target.closest(element)) {
        targetElement.classList.toggle(addClassName);

        // Якщо вікно відкривається, ховаємо notificationDot
        if (targetElement.classList.contains(addClassName)) {
            document.querySelector(".notificationDot").style.display = "none";
        }

    } else if (isActive) {
        targetElement.classList.remove(addClassName);
    }
}

// Обробник кліків для закриття/відкриття вікон профілю та сповіщень
document.addEventListener("click", function (event) {
    toggleActiveClass(".profileWindow", event, "active");
    toggleActiveClass(".notificationWindow", event, "active");
})


const notificationIcon = document.querySelector(".bi-bell");
const notificationDot = document.querySelector(".notificationDot");
const notificationMessage = document.querySelector(".notificationMessage");

function animationMessage() {
    notificationIcon.style.animation = "none"; // Скидаємо анімацію

    setTimeout(() => {
        notificationIcon.style.animation = "moveBell 0.5s ease";
    }, 10);

    setTimeout(() => {
        notificationMessage.style.display = "block";
    }, 500);

    setTimeout(() => {
        notificationMessage.style.display = "none";
        notificationDot.style.display = "block";
    }, 2000);
}

notificationIcon.addEventListener("dblclick", animationMessage);
//---------------------------------------------//
//бургер меню
const menuButton = document.querySelector(".menuButton");
const aside = document.querySelector("aside");
menuButton.addEventListener("click", function (event) {
    event.stopPropagation();
    aside.classList.toggle("open");
});
document.addEventListener("click", function (event) {
    if(!event.target.closest("aside")) {
        aside.classList.remove("open");
    }
});

//aside навігація сторінки
document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".navigationAside a");

    links.forEach(link => {
        if (window.location.pathname.includes(link.getAttribute("href"))) {
            link.classList.add("activeHref");
        }
    });
});