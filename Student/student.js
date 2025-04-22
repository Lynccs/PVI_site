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

    const allRows = [];
    const rowsPerPage = 5;
    let currentPage = 1;

    //відображаємо модальне вікно при натисканні кнопки
    addButton.addEventListener("click", function () {
        requiredAuth(() => {
            modalWindow.style.display = "block";
            overlay.style.display = "block";
            createButton.innerText = "Create"; // Встановлюємо текст кнопки
            modalForm.reset();
            isEditing = false;
        });
    });

    function closeModal() {
        modalWindow.style.display = "none";
        overlay.style.display = "none";
        document.querySelector(".modalTitle").innerHTML = "Add student";
        modalForm.reset();
        isEditing = false;
    }

    function addRowToTable(group, firstName, lastName, gender, formattedBirthday, userID) {
        // Створюємо новий рядок для таблиці
        const newRow = document.createElement("tr");

        // створюємо комірку для checkbox
        const td1 = document.createElement("td");
        const label = document.createElement("label");
        label.setAttribute("aria-label", "Select row");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        label.appendChild(checkbox);
        td1.appendChild(label);

        // творюємо інші комірки з даними
        const td2 = document.createElement("td");
        td2.textContent = group;

        const td3 = document.createElement("td");
        td3.textContent = `${firstName} ${lastName}`;

        const td4 = document.createElement("td");
        td4.textContent = gender;

        const td5 = document.createElement("td");
        td5.textContent = formattedBirthday;

        // статус
        const td6 = document.createElement("td");
        const statusSpan = document.createElement("span");
        statusSpan.classList.add("status", "offline");
        td6.appendChild(statusSpan);

        // кнопки
        const td7 = document.createElement("td");
        const editBtn = document.createElement("button");
        editBtn.classList.add("actionBtn", "editBtn");
        editBtn.setAttribute("aria-label", "Edit button");
        editBtn.innerHTML = '<i class="bi bi-pencil"></i>';

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("actionBtn", "deleteBtn");
        deleteBtn.setAttribute("aria-label", "Delete button");
        deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
        td7.appendChild(editBtn);
        td7.appendChild(deleteBtn);

        // прихований ID
        const td8 = document.createElement("td");
        td8.classList.add("hiddenColumn");
        td8.textContent = userID;
        newRow.dataset.userId = userID; // додаємо ID у dataset, "зашиваємо в html в рядок"
        console.log(userID);

        newRow.appendChild(td1);
        newRow.appendChild(td2);
        newRow.appendChild(td3);
        newRow.appendChild(td4);
        newRow.appendChild(td5);
        newRow.appendChild(td6);
        newRow.appendChild(td7);
        newRow.appendChild(td8);

        //tableBody.appendChild(newRow);
        allRows.push(newRow);
        renderTablePage(currentPage);

        const studentDate = {
            group: group,
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            birthday: formattedBirthday,
            userID: userID
        }

        const jsonString = JSON.stringify(studentDate);
        console.log("Added student:", jsonString);

        updateButtonsState(); //відображення кнопок відповідно до checkbox
        updateUserStatus();
    }

    function editRow(editingRow, group, firstName, lastName, gender, formattedBirthday) {
        const cells = editingRow.querySelectorAll("td");

        // Зчитуємо існуючий userID з dataset
        const userID = editingRow.dataset.userId;

        cells[1].textContent = group;
        cells[2].textContent = `${firstName} ${lastName}`;
        cells[3].textContent = gender;
        cells[4].textContent = formattedBirthday;
        cells[7].textContent = userID;

        editingRow.dataset.userId = userID;
        console.log(`editID: ${userID}`);

        const studentDate = {
            group: group,
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            birthday: formattedBirthday,
            userID: userID
        }

        const index = allRows.findIndex(row => row.userId === userID);

        if (index !== -1){
            allRows[index] = editingRow;
        }

        const jsonString = JSON.stringify(studentDate);
        console.log("Edit student:", jsonString);

        updateButtonsState();
        updateUserStatus();
    }

    function deleteRow(rowsToDelete) {
        rowsToDelete.forEach(row => {
            const userId = row.dataset.userId;
            const index = allRows.findIndex(r => r.dataset.userId === userId);
            if (index !== -1) {
                allRows.splice(index, 1);
            }
        });
        updateButtonsState();
        renderTablePage(currentPage);
        renderPaginationButton();
    }

    function closeDeleteWindow() {
        document.getElementById("deleteWindow").style.display = "none";
        document.getElementById("overlay").style.display = "none";
    }


    function validateNameField(e, namePattern) {
        const field = e.target;
    
      if (!namePattern.test(field.value)) {
            field.setCustomValidity(field.id === 'firstName' 
               ? "Ім'я має починатися з великої літери та містити від 2 до 20 літер." 
               : "Прізвище має починатися з великої літери та містити від 2 до 20 літер.");
        } else {
         field.setCustomValidity("");
        }
    
      // кажемо формі перевірити валідність знову
      field.reportValidity();
    }
    
    modalForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const firstNameV = document.getElementById("firstName");
        const lastNameV = document.getElementById("lastName");

        const firstnamePattern = /^[A-Z][a-z]{0,18}(-[A-Z][a-z]*)?$/;
        const lastnamePattern = /^[A-Z][a-z]{1,19}$/;

        firstNameV.addEventListener('input', (e) => validateNameField(e, firstnamePattern));
        lastNameV.addEventListener('input', (e) => validateNameField(e, lastnamePattern));



        // Зчитуємо значення з форми
        const group = document.getElementById("dropdown").value;
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const gender = document.getElementById("gender").value;
        const birthday = document.getElementById("birthday").value;
        const formUserID = document.getElementById("userID").value;

        const date = new Date(birthday); // Перетворюємо на об'єкт Date
        // Форматуємо дату
        const formattedBirthday = (date.getDate()).toString().padStart(2, '0') +
            '.' + (date.getMonth() + 1).toString().padStart(2, '0') + '.' + date.getFullYear();

        if (isEditing && editingRow) {
            if (formUserID !== editingRow.dataset.userId) {
                alert("Помилка: ID користувача не збігається. Спробуйте ще раз.");
                return;
            }

            fetch("../controllers/studentController.php?action=editStudent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: formUserID,
                    group_name: group,
                    first_name: firstName,
                    last_name: lastName,
                    gender: gender,
                    birthday: birthday
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log(data.student);
                        const student = data.student;
                        const parts = student.birthday.split('-');
                        const formattedDate = `${parts[2]}.${parts[1]}.${parts[0]}`;

                        editRow(editingRow, student.group_name, student.first_name, student.last_name, student.gender, formattedDate);

                        // Скидаємо стан після редагування
                        isEditing = false;
                        editingRow = null;
                        createButton.innerText = "Create";

                        // Закриваємо модальне вікно
                        document.querySelector(".modalTitle").innerHTML = "Add student";
                        closeModal();
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                });

        } else {
            fetch('../controllers/studentController.php?action=addStudent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    group_name: group,
                    first_name: firstName,
                    last_name: lastName,
                    gender: gender,
                    birthday: formattedBirthday,
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        if (data.students) {
                            allRows.length = 0;
                            tableBody.innerHTML = '';
                            data.students.forEach(student => {
                                const parts = student.birthday.split('-');
                                const formattedDate = `${parts[2]}.${parts[1]}.${parts[0]}`;

                                addRowToTable(
                                    student.group_name,
                                    student.first_name,
                                    student.last_name,
                                    student.gender,
                                    formattedDate,
                                    student.id
                                );
                            });
                            alert("Successfully add student!");
                        }
                    } else {
                        const message = data.message || "Failed add student!";
                        alert(message);
                    }
                })
                .catch(error => {
                    console.log("Error: ", error);
                    alert("Error on the server");
                });
            //const userID = crypto.randomUUID();
            //addRowToTable(group, firstName, lastName, gender, formattedBirthday, userID);

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
            const userID = editBtn.closest("tr").dataset.userId; // Отримуємо ID з атрибута dataset\
            console.log(userID);
            editingRow = tableBody.querySelector(`tr[data-user-id="${userID}"]`); // Шукаємо рядок по ID
            console.log(editingRow);

            /*editingRow = editBtn.closest("tr"); */// Зберігаємо рядок для редагування

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
            document.getElementById("userID").value = userID;

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
                const userID = deleteBtn.closest("tr").dataset.userId;
                /*const row = deleteBtn.closest("tr");*/
                const row = tableBody.querySelector(`tr[data-user-id="${userID}"]`);
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
                const idsToDelete = rowsToDelete.map(row => Number(row.dataset.userId));
                fetch('../controllers/studentController.php?action=deleteStudent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ids : idsToDelete})
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            deleteRow(rowsToDelete);
                            closeDeleteWindow();
                        } else {
                            const message = data.message || "Failed delete student!";
                            alert(message);
                        }
                    })
                    .catch(error => {
                        console.log("Error: ", error);
                        alert("Error on the server");
                    });
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

    // відображення сторінок таблиці
    function renderTablePage(page){
        tableBody.innerHTML = "";

        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;

        const rowsToDisplay = allRows.slice(startIndex, endIndex);
        rowsToDisplay.forEach(row => tableBody.appendChild(row));

        currentPage = page;

        renderPaginationButton();
        updateUserStatus();
        updateButtonsState();
    }

    // відображення кнопок пагінації
    function renderPaginationButton(){
        const pageNumber = document.getElementById("pageNumbers");
        pageNumber.innerText = "";

        const totalPages = Math.ceil(allRows.length / rowsPerPage);
        for(let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;

            if (i === currentPage) {
                pageButton.classList.add("active");
            }

            pageButton.addEventListener("click", () => {
                renderTablePage(i);
            });

            pageNumber.appendChild(pageButton);
        }
        document.getElementById("prevPage").disabled = currentPage === 1;
        document.getElementById("nextPage").disabled = currentPage === totalPages;
    }

    document.getElementById("prevPage").addEventListener("click", () => {
        if (currentPage > 1) {
            renderTablePage(currentPage - 1);
        }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
        const totalPages = Math.ceil(allRows.length / rowsPerPage);
        if (currentPage < totalPages) {
            renderTablePage(currentPage + 1);
        }
    });

    // кнопка авторизації Log in
    function openLoginForm() {
        overlay.style.display = "block";
        document.getElementById("loginWindow").style.display = "block";
    }
    function closeLoginForm() {
        console.log("closeLoginForm called");
        console.log("overlay:", overlay);
        overlay.style.display = "none";
        document.getElementById("loginWindow").style.display = "none";
        document.getElementById("loginName").value = '';
        document.getElementById("loginSurname").value = '';
        document.getElementById("loginBirthday").value = '';
        console.log("closeLoginForm called after");
        console.log("overlay:", overlay);
    }

    document.addEventListener("click", function (event) {
        console.log("Click event on", event.target);
    });

    document.querySelector(".cancelLogIn").addEventListener("click", function() {
        console.log("Cancel button clicked");
        //event.stopPropagation();  // Зупиняємо поширення події
        closeLoginForm();
    });


    document.querySelector(".closeLogin").addEventListener("click", function () {
        closeLoginForm();
    });

    document.getElementById("loginButton").addEventListener("click", function () {
        console.log("клік Log in");
        //event.stopPropagation(); // не передаємо делегуванню
        openLoginForm();
    })

    /*async function checkAuthorization(event) {
        try {
            const res = await fetch('../controllers/authController.php?action=sessionCheck');
            const data = await res.json();

            if (!data.success) {
                /!*event.preventDefault();
                event.stopPropagation();*!/
                openLoginForm();
            }
        } catch (error) {
            console.log("Error: ", error);
            alert("Error on the server");
        }
    }*/


    function requiredAuth(actionIfAuthorized) {
        fetch('../controllers/authController.php?action=sessionCheck')
            .then(res => res.json())
            .then(data => {
                if(!data.success) {
                    openLoginForm();
                } else {
                    actionIfAuthorized();
                }
            })
            .catch(error => {
                console.log("Error: ",error);
                alert("Error on the server");
            });
    }

    // делегування події
    document.addEventListener("click", async function (event) {
        const target = event.target;

        if(target.closest("#loginButton")) return;
        if (target.closest("form")) return;


        if ((target.closest("button") || target.closest("a")) && !target.closest("#addButton")) {
            /*event.preventDefault();
            event.stopPropagation();
            await checkAuthorization(event);*/
            event.preventDefault();
            event.stopPropagation();

            try {
                // Перевірка на авторизацію
                const res = await fetch('../controllers/authController.php?action=sessionCheck');
                const data = await res.json();

                if (!data.success) {
                    openLoginForm();
                } else {
                    // Якщо авторизовано, дозволяємо перехід на сторінку
                    // Перевіряємо, чи є href у елемента
                    const link = target.closest("a");
                    if (link) {
                        window.location.href = link.href;  // Переходимо на лінк
                    }
                }
            } catch (error) {
                console.log("Error: ", error);
                alert("Error on the server");
            }
        }
    });

    //відображення кнопки
    fetch('../controllers/authController.php?action=session')
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                document.getElementById("profileName").textContent =
                    data.loginName + " " + data.loginSurname;
                document.getElementById("loginButton").style.display = "none";
            } else {
                const loginButton = document.getElementById("loginButton");
                if (loginButton) loginButton.style.display = "block";
            }
        })
        .catch(error => {
            console.log("Error: ",error);
            alert("Error on the server");
        });

    //відображення студентів в таблиці
    function displayStudent() {
        fetch('../controllers/studentController.php?action=getAllStudent')
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    allRows.length = 0;
                    tableBody.innerHTML = '';
                    data.students.forEach(student => {
                        const parts = student.birthday.split('-');
                        const formattedDate = `${parts[2]}.${parts[1]}.${parts[0]}`;

                        addRowToTable(
                            student.group_name,
                            student.first_name,
                            student.last_name,
                            student.gender,
                            formattedDate,
                            student.id
                        );
                    });
                    renderTablePage(currentPage);
                    renderPaginationButton();
                } else {
                    alert("Не вдалося завантажити студентів");
                }
            })
            .catch(error => {
                console.log("Error: ",error);
                alert("Error on the server");
            });
    }

    requiredAuth(() => {
        displayStudent();
    });


    // відправка даних форми на контролер
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        console.log("Submit dont work");
        event.preventDefault();
        event.stopPropagation();

        const loginNameInput = document.getElementById("loginName");
        const loginSurnameInput = document.getElementById("loginSurname");
        const loginBirthday = document.getElementById("loginBirthday").value

        const firstnamePattern = /^[A-Z][a-z]{0,18}(-[A-Z][a-z]*)?$/;
        const lastnamePattern = /^[A-Z][a-z]{1,19}$/;

        loginNameInput.addEventListener('input', (e) => validateNameField(e, firstnamePattern));
        loginSurnameInput.addEventListener('input', (e) => validateNameField(e, lastnamePattern));

        const requestData = {
            loginName: loginNameInput.value,
            loginSurname: loginSurnameInput.value,
            loginBirthday: loginBirthday
        };

        console.log("Submit working");

        fetch('../controllers/authController.php?action=login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Server response:", data);
            if (data.success) {
                closeLoginForm();
                alert("Successfully logged in!");
                document.getElementById("loginButton").style.display = "none";
                document.getElementById("profileName").textContent = requestData["loginName"] + " " + requestData["loginSurname"];

                displayStudent();
            } else {
                const message = data.message || "Failed to log in!";
                alert(message);
            }
        })
        .catch(error => {
            console.log("Error: ",error);
            alert("Error on the server");
        });
    });


});




function updateUserStatus() {
    fetch('../controllers/studentController.php?action=getOnlineStudents')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const onlineStudents = data.students;
                const tableBody = document.getElementById("tableBody");

                tableBody.querySelectorAll("tr").forEach(row => {
                    const nameCell = row.querySelector("td:nth-child(3)");
                    const statusCell = row.querySelector(".status");

                    if (nameCell && statusCell) {
                        statusCell.classList.remove("online", "offline");

                        const studentIsOnline = onlineStudents.some(student =>
                            student.first_name + " " + student.last_name === nameCell.textContent.trim()
                        );

                        if (studentIsOnline) {
                            statusCell.classList.add("online");
                        } else {
                            statusCell.classList.add("offline");
                        }
                    }
                });
            } else {
                console.error("Не вдалося отримати список онлайн студентів.");
            }
        })
        .catch(error => console.error("Помилка при отриманні статусу студентів:", error));
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");

    setInterval(() => {
        fetch('../controllers/authController.php?action=pingOnline')
            .then(res => res.json())
            .then(data => console.log("Ping status:", data));
    }, 0.1 * 60 * 1000); // кожні 2 хвилини

    updateUserStatus();

    setInterval(() => {
        console.log("updateUserStatus triggered");
        updateUserStatus();
    }, 0.1 * 60 * 1000);
});








