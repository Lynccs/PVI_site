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
    addButton.addEventListener("click", function () {
        modalWindow.style.display = "block";
        overlay.style.display = "block";
        createButton.innerText = "Create"; // Встановлюємо текст кнопки
        modalForm.reset();
        isEditing = false;
    });

    function closeModal() {
        modalWindow.style.display = "none";
        overlay.style.display = "none";
        document.querySelector(".modalTitle").innerHTML = "Add student";
        modalForm.reset();
        isEditing = false;
    }

    function addRowToTable(group, firstName, lastName, gender, formattedBirthday) {
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
        updateButtonsState(); //відображення кнопок відповідно до checkbox
        updateUserStatus();
    }

    function editRow(editingRow, group, firstName, lastName, gender, formattedBirthday) {
        const cells = editingRow.querySelectorAll("td");
        cells[1].innerText = group;
        cells[2].innerText = `${firstName} ${lastName}`;
        cells[3].innerText = gender;
        cells[4].innerText = formattedBirthday;

        updateButtonsState(); //відображення кнопок відповідно до checkbox
        updateUserStatus();
    }

    function deleteRow(rowsToDelete) {
        rowsToDelete.forEach(row => {row.remove();});
        updateButtonsState();
    }

    function closeDeleteWindow() {
        document.getElementById("deleteWindow").style.display = "none";
        document.getElementById("overlay").style.display = "none";
    }


    modalForm.addEventListener("submit", function (event) {

        event.preventDefault();  // Запобігаємо стандартному відправленню форми

        // Перевірка форми на валідність
        if (!modalForm.checkValidity()) {
            return;
        }
    /*createButton.addEventListener("click", function () {*/

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
            editRow(editingRow, group, firstName, lastName, gender, formattedBirthday);

            // Скидаємо стан після редагування
            isEditing = false;
            editingRow = null;
            createButton.innerText = "Create";

            // Закриваємо модальне вікно
            document.querySelector(".modalTitle").innerHTML = "Add student";
            closeModal();

        } else {
            addRowToTable(group, firstName, lastName, gender, formattedBirthday);

           closeModal()
        }
    });


    cancelButton.addEventListener("click", closeModal);
    closeButton.addEventListener("click", closeModal);


    // Обробка натискання кнопки "editBtn"
    tableBody.addEventListener("click", function (event) {
        console.log("Клік по таблиці");

        //------редагування
        // Перевірка, чи натиснута кнопка редагування
        const editBtn = event.target.closest(".editBtn");

        if (editBtn) {
            console.log("Натиснуто кнопку редагування");

            isEditing = true;
            editingRow = editBtn.closest("tr"); // Зберігаємо рядок для редагування

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
        const deleteBtn = event.target.closest(".deleteBtn");
        if (deleteBtn) {
            const checkedCheckbox = tableBody.querySelectorAll("input[type='checkbox']:checked");
            let nameSurname = [];
            let rowsToDelete = [];

            if (checkedCheckbox.length === 0) {
                const row = deleteBtn.closest("tr");
                nameSurname.push(row.querySelector("td:nth-child(3)").innerText);
                rowsToDelete.push(row);
            } else {
                tableBody.querySelectorAll("tr").forEach((row) => {
                    const checkbox = row.querySelector("input[type='checkbox']");
                    if (checkbox.checked) {
                        nameSurname.push(row.querySelector("td:nth-child(3)").innerText);
                        rowsToDelete.push(row);
                    }
                })
            }

            document.getElementById("deleteMessage").innerHTML =
                `Are you sure you want to delete ${nameSurname.length === 1 ? nameSurname[0] : nameSurname.join(", ")}?`;
            document.getElementById("deleteWindow").style.display = "block";
            document.getElementById("overlay").style.display = "block";

            const confirmDelete = document.querySelector(".confirmDelete");
            const cancelDelete = document.querySelector(".cancelDelete");
            const closeDelete = document.querySelector(".closeDelete");

            confirmDelete.replaceWith(confirmDelete.cloneNode(true)); // Замінюємо елемент, щоб очистити слухачі
            cancelDelete.replaceWith(cancelDelete.cloneNode(true));
            closeDelete.replaceWith(closeDelete.cloneNode(true));

            document.querySelector(".confirmDelete").addEventListener("click", function () {
                deleteRow(rowsToDelete);
                closeDeleteWindow();
            });
            document.querySelector(".cancelDelete").addEventListener("click", closeDeleteWindow);
            document.querySelector(".closeDelete").addEventListener("click", closeDeleteWindow);

        }

    });

    function updateButtonChecked(button, isDisabled) {
        if (isDisabled) {
            button.setAttribute("disabled", "true");
            button.classList.remove("active");
        } else {
            button.removeAttribute("disabled");
            button.classList.add("active");
        }
    }


    /*tableBody.addEventListener("change", function (event) {
        console.log(event.target); // Логування
        if (event.target && event.target.type === "checkbox") {
            const checkedCheckbox = tableBody.querySelectorAll("input[type='checkbox']:checked");

            tableBody.querySelectorAll("tr").forEach(row => {
                const editBtn = row.querySelector(".editBtn");
                const deleteBtn = row.querySelector(".deleteBtn");
                const checkbox = row.querySelector("input[type='checkbox']");

                if(checkbox && checkedCheckbox.length > 0){
                    if (checkbox.checked) {
                        if(checkedCheckbox.length === 1) {
                            updateButtonChecked(editBtn, false);
                            updateButtonChecked(deleteBtn, false);
                        } else {
                            updateButtonChecked(editBtn, true);
                            updateButtonChecked(deleteBtn, false);
                        }

                    } else {
                        updateButtonChecked(editBtn, true);
                        updateButtonChecked(deleteBtn, true);
                    }
                } else {
                    updateButtonChecked(editBtn, false);
                    updateButtonChecked(deleteBtn, false);
                }
            })


            /!*const row = event.target.closest("tr");
            const editBtn = row.querySelector(".editBtn");
            const deleteBtn = row.querySelector(".deleteBtn");

            const checkedCheckbox = tableBody.querySelectorAll("input[type='checkbox']:checked").length;

            if (checkedCheckbox > 1) {
                updateButtonChecked(editBtn, true);
                updateButtonChecked(deleteBtn, false);
            } else {
                if(event.target.checked) {
                    updateButtonChecked(editBtn, false);
                    updateButtonChecked(deleteBtn, false);
                    setDisabledButton();
                } else {
                    updateButtonChecked(editBtn, true);
                    updateButtonChecked(deleteBtn, true);
                }
            }*!/
        }
    });*/

    const mainCheckbox = document.querySelector("thead input[type='checkbox']");

    mainCheckbox.addEventListener("change", function () {
        const isChecked = mainCheckbox.checked;

        tableBody.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
            checkbox.checked = isChecked;
        });

        updateButtonsState();
    });

    function updateButtonsState() {
        const checkedCheckbox = tableBody.querySelectorAll("input[type='checkbox']:checked");
        const count = checkedCheckbox.length;

        tableBody.querySelectorAll("tr").forEach(row => {
            const editBtn = row.querySelector(".editBtn");
            const deleteBtn = row.querySelector(".deleteBtn");
            const checkbox = row.querySelector("input[type='checkbox']");

            if (!checkbox) return;

            if (count === 0 || (count === 1 && checkbox.checked)) {
                updateButtonChecked(editBtn, false);
                updateButtonChecked(deleteBtn, false);
            } else if (count > 1 && checkbox.checked) {
                updateButtonChecked(editBtn, true);
                updateButtonChecked(deleteBtn, false);
            } else {
                updateButtonChecked(editBtn, true);
                updateButtonChecked(deleteBtn, true);
            }
        });
    }


// Додаємо обробник події для окремих чекбоксів
    tableBody.addEventListener("change", function (event) {
        if (event.target && event.target.type === "checkbox") {
            updateButtonsState();
        }
    });

});

function updateUserStatus() {
    const profileName = document.getElementById("profileName").textContent.trim();
    const tableBody = document.getElementById("tableBody");

    tableBody.querySelectorAll("tr").forEach(row => {
        const nameCell = row.querySelector("td:nth-child(3)");
        const statusCell = row.querySelector(".status");

        if(nameCell && statusCell) {
            statusCell.classList.remove("online", "offline");
            if(nameCell.textContent.trim() === profileName) {
                statusCell.classList.add("online");
            } else {
                statusCell.classList.add("offline");
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", updateUserStatus);






