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
})
document.addEventListener("click", function (event) {
    if(!event.target.closest("aside")) {
        aside.classList.remove("open")
    }
})

//aside навігація сторінки
document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".navigationAside a");

    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("activeHref");
        }
    });
});
//---------------------------------------------//
//модальне вікно додавання/редагування/видалення
document.addEventListener("DOMContentLoaded", function () {
    const createButton = document.querySelector(".modalButton[type='submit']");
    const cancelButton = document.querySelector(".modalButton.cancel");
    const closeButton = document.querySelector(".close");
    const modalWindow = document.getElementById("modalWindow");
    const overlay = document.getElementById("overlay");
    const modalForm = document.getElementById("modalForm");
    const tableBody = document.getElementById("tableBody");
    const addButton = document.getElementById("addButton");

    let isEditing = false;
    let editingRow = null;

    //відображаємо модальне вікно при натисканні кнопки
    addButton.addEventListener("click", function (event) {
        modalWindow.style.display = "block";
        overlay.style.display = "block";
        createButton.innerText = "Create"; // Встановлюємо текст кнопки
        modalForm.reset();
        isEditing = false;
    });

    createButton.addEventListener("click", function () {
        // Зчитуємо значення з форми
        const group = document.getElementById("dropdown").value;
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const gender = document.getElementById("gender").value;
        const birthday = document.getElementById("birthday").value;

        const date = new Date(birthday); // Перетворюємо на об'єкт Date

        // Форматуємо дату
        const formattedBirthday = (date.getDate()).toString().padStart(2, '0') +
            '.' + (date.getMonth() + 1).toString().padStart(2, '0') + '.' + date.getFullYear();

        if (isEditing && editingRow) {
            const cells = editingRow.querySelectorAll("td");
            cells[1].innerText = group;
            cells[2].innerText = `${firstName} ${lastName}`;
            cells[3].innerText = gender;
            cells[4].innerText = formattedBirthday;

            // Скидаємо стан після редагування
            isEditing = false;
            editingRow = null;
            createButton.innerText = "Create";

            // Закриваємо модальне вікно
            modalWindow.style.display = "none";
            overlay.style.display = "none";
            document.querySelector(".modalTitle").innerHTML = "Add student";
            modalForm.reset();
        } else {
            // Створюємо новий рядок для таблиці
            const newRow = document.createElement("tr");

            newRow.innerHTML = `
                <td><input type="checkbox"></td>
                <td>${group}</td>
                <td>${firstName} ${lastName}</td>
                <td>${gender}</td>
                <td>${formattedBirthday}</td>
                <td><span class="status offline"></span></td>
                <td>
                    <button class="actionBtn editBtn"><i class="bi bi-pencil"></i></button>
                    <button class="actionBtn deleteBtn"><i class="bi bi-trash"></i></button>
                </td>
                <td class="hiddenColumn">1</td>
            `;

            tableBody.appendChild(newRow);

            // Закриваємо модальне вікно
            modalWindow.style.display = "none";
            overlay.style.display = "none";
            modalForm.reset();
        }
    });

    function closeModal() {
        modalWindow.style.display = "none";
        overlay.style.display = "none";
        document.querySelector(".modalTitle").innerHTML = "Add student";
        modalForm.reset();
        isEditing = false;
    }

    cancelButton.addEventListener("click", closeModal);
    closeButton.addEventListener("click", closeModal);

    // Обробка натискання кнопки "editBtn"
    tableBody.addEventListener("click", function (event) {
        console.log("Клік по таблиці");

        //------редагування
        // Перевірка, чи натиснута кнопка редагування
        const targetBtn = event.target.closest(".editBtn");

        if (targetBtn) {
            console.log("Натиснуто кнопку редагування");

            isEditing = true;
            editingRow = targetBtn.closest("tr"); // Зберігаємо рядок для редагування

            const cells = editingRow.querySelectorAll("td");
            const group = cells[1].innerText;
            const name = cells[2].innerText.split(" ");
            const firstName = name[0];
            const lastName = name[1];
            const gender = cells[3].innerText;
            const birthdayCellText = cells[4].innerText;
            const [day, month, year] = birthdayCellText.split(".");


            document.getElementById("dropdown").value = group;
            document.getElementById("firstName").value = firstName;
            document.getElementById("lastName").value = lastName;
            document.getElementById("gender").value = gender;
            document.getElementById("birthday").value = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            // Перетворили у формат YYYY-MM-DD

            modalWindow.style.display = "block";
            overlay.style.display = "block";
            document.querySelector(".modalTitle").innerText = "Edit student";
            createButton.innerText = "Save";

        }
        //------видалення
        const delButton = event.target.closest(".deleteBtn");
        if (delButton) {

            const row = delButton.closest("tr");
            const nameSurname = row.querySelector("td:nth-child(3)").innerText;

            document.getElementById("deleteMessage").innerHTML = `Are you sure you want to delete ${nameSurname}?`

            document.getElementById("deleteWindow").style.display = "block";
            document.getElementById("overlay").style.display = "block";

            const confirmDelete = document.querySelector(".confirmDelete");
            const cancelDelete = document.querySelector(".cancelDelete");
            const closeDelete = document.querySelector(".closeDelete");

            function handleDelete() {
                row.remove();
                closeDeleteWindow();
            }

            function closeDeleteWindow() {
                document.getElementById("deleteWindow").style.display = "none";
                document.getElementById("overlay").style.display = "none";
            }

            confirmDelete.replaceWith(confirmDelete.cloneNode(true)); // Замінюємо елемент, щоб очистити слухачі
            cancelDelete.replaceWith(cancelDelete.cloneNode(true));
            closeDelete.replaceWith(closeDelete.cloneNode(true));

            document.querySelector(".confirmDelete").addEventListener("click", handleDelete);
            document.querySelector(".cancelDelete").addEventListener("click", closeDeleteWindow);
            document.querySelector(".closeDelete").addEventListener("click", closeDeleteWindow);

        }

    });

});







