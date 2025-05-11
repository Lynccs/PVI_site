document.addEventListener("DOMContentLoaded", function () {
    const newChatButton = document.getElementById("addChatButton");
    const addChatWindow = document.getElementById("addChatWindow");
    const overlay = document.getElementById("overlay");
    const addChatForm = document.getElementById("addChatForm");

    const cancelAddButton = document.querySelector(".cancelAddChat");
    const closeAddButton = document.querySelector(".closeAddChat");

    const infoChatButton = document.getElementById("chatInfoButton");
    const closeInfoButton = document.querySelector(".closeModalChatInfo");
    const infoChatWindow = document.getElementById("chatInfoModal");

    const checkboxIsGroup = document.getElementById("isGroup");

    const chatListUl = document.querySelector(".chatListItem ul");
    const notificationUl = document.querySelector(".notificationOptions ul");

    newChatButton.addEventListener("click", function () {
        addChatWindow.style.display = "block";
        overlay.style.display = "block";
        addChatForm.reset();
    });

    function closeModal() {
        addChatWindow.style.display = "none";
        overlay.style.display = "none";
        addChatForm.reset();
    }
    cancelAddButton.addEventListener("click", closeModal);
    closeAddButton.addEventListener("click", closeModal);

    closeInfoButton.addEventListener("click", function () {
        infoChatWindow.style.display = "none";
        overlay.style.display = "none";
    });
    infoChatButton.addEventListener("click", function () {
        infoChatWindow.style.display = "block";
        overlay.style.display = "block";
    })

    checkboxIsGroup.addEventListener("change", function () {
        const elementsToToggle = [
            document.getElementById("chatNameLabel"),
            document.getElementById("chatName"),
            document.getElementById("memberLabel"),
            document.getElementById("memberList")
        ];
        const chatNameInput = document.getElementById("chatName");
        const addMemberButton = document.querySelector(".addMemberButton");
        const shouldShow = checkboxIsGroup.checked;

        elementsToToggle.forEach(el => {
            el.style.display = shouldShow ? "block" : "none";
        });

        addMemberButton.style.display = shouldShow ? "flex" : "none";

        // Динамічне керування required
        if (shouldShow) {
            chatNameInput.setAttribute("required", "required");
        } else {
            chatNameInput.removeAttribute("required");
        }
    });


    addChatForm.addEventListener("submit", function (event) {
        event.preventDefault();
        console.log("Форма відправлена!");

        const isGroup = checkboxIsGroup.checked;
        let chatTitle = "";

        if(!isGroup) {
            const firstName = document.getElementById("chatUserName").value;
            const lastName = document.getElementById("chatUserSurname").value;
            const birthday = document.getElementById("chatBirthday").value;

            const date = new Date(birthday);
            const formattedBirthday = (date.getDate()).toString().padStart(2, '0') +
                '.' + (date.getMonth() + 1).toString().padStart(2, '0') + '.' + date.getFullYear();

            fetch('../controllers/studentController.php?action=isStudentExist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    birthday: formattedBirthday,
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {


                        alert("Successfully create chat!");

                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.log("Error: ", error);
                    alert("Error on the server");
                });
            ////////////

            chatTitle = `${firstName} ${lastName}`;
        } else {
            const chatName = document.getElementById("chatName").value.trim();
            chatTitle = `Group: ${chatName}`;
        }

        const li = document.createElement("li");
        li.innerHTML = `<i class="bi bi-person-circle"></i> ${chatTitle}`;

        chatListUl.insertBefore(li, chatListUl.firstChild);

        closeModal();
    });


});