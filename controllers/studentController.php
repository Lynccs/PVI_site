<?php
require_once __DIR__ . '/../model/studentModel.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['action']) && $_GET['action'] == 'addStudent'){
    session_start();

    $jsonData = file_get_contents('php://input'); // читаємо тіло запиту
    $data = json_decode($jsonData, true); // Перетворюємо JSON у асоціативний масив

    if(isset($data['group_name'], $data['first_name'], $data['last_name'], $data['gender'] , $data['birthday'])) {
        $group_name = $data['group_name'];
        $first_name = $data['first_name'];
        $last_name = $data['last_name'];
        $gender = $data['gender'];
        $birthday = $data['birthday'];

        $namePattern = '/^[A-Z][a-z]{0,18}(-[A-Z][a-z]*)?$/';
        $surnamePattern = '/^[A-Z][a-z]{1,19}$/';
        $minDate = new DateTime('1900-01-01');
        $maxDate = new DateTime('2025-12-31');

        if (!preg_match($namePattern, $first_name)) {
            echo json_encode([
                'success' => false,
                'message' => "Ім'я некоректне. Воно має починатися з великої літери й містити від 2 до 20 літер."
            ]);
            exit;
        }

        if (!preg_match($surnamePattern, $last_name)) {
            echo json_encode([
                'success' => false,
                'message' => "Прізвище некоректне. Воно має починатися з великої літери й містити від 2 до 20 літер."
            ]);
            exit;
        }

        try {
            $birthdayDate = new DateTime($birthday);
            if ($birthdayDate < $minDate || $birthdayDate > $maxDate) {
                echo json_encode([
                    'success' => false,
                    'message' => "Дата має бути між 01.01.1900 і 31.12.2025"
                ]);
                exit;
            }
        } catch (Exception $e) {
            echo json_encode([
                'success' => false,
                'message' => "Невірний формат дати народження."
            ]);
            exit;
        }


        $model = new studentModel();

        if ($model->studentExists($first_name, $last_name, $birthday)) {
            echo json_encode([
                "success" => false,
                "message" => "Такий студент уже існує."
            ]);
            exit;
        }

        $students = $model->addStudentToTable($group_name, $first_name, $last_name, $gender, $birthday);
        if($students){
            echo json_encode([
                'success' => true,
                'isAdmin' => $_SESSION['isAdmin'] ?? false
            ]);
        }
    }
} else if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['action']) && $_GET['action'] == 'getPaginationStudent'){
    session_start();

    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData, true);

    if(isset($data['limit'], $data['offset'])) {
        $limit = $data['limit'];
        $offset = $data['offset'];

        $model = new studentModel();
        $students = $model->getPaginationStudent($limit, $offset);

        echo json_encode([
            'success' => true,
            'students' => $students,
            'isAdmin' => $_SESSION['isAdmin'] ?? false
        ]);
    }
    exit;
} else if($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['action']) && $_GET['action'] == 'getTotalStudentsCount'){
    session_start();

    $model = new studentModel();
    $total = $model->getTotalStudentsCount();

    echo json_encode([
        'success' => true,
        'total' => $total
    ]);
    exit;
} else if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['action']) && $_GET['action'] == 'editStudent'){
    session_start();

    $jsonData = file_get_contents('php://input'); // читаємо тіло запиту
    $data = json_decode($jsonData, true); // Перетворюємо JSON у асоціативний масив

    if(isset($data['id'] , $data['group_name'], $data['first_name'], $data['last_name'], $data['gender'] , $data['birthday'])) {
        $id = $data['id'];
        $group_name = $data['group_name'];
        $first_name = $data['first_name'];
        $last_name = $data['last_name'];
        $gender = $data['gender'];
        $birthday = $data['birthday'];

        $namePattern = '/^[A-Z][a-z]{0,18}(-[A-Z][a-z]*)?$/';
        $surnamePattern = '/^[A-Z][a-z]{1,19}$/';
        $minDate = new DateTime('1900-01-01');
        $maxDate = new DateTime('2025-12-31');

        if (!preg_match($namePattern, $first_name)) {
            echo json_encode([
                'success' => false,
                'message' => "Ім'я некоректне. Воно має починатися з великої літери й містити від 2 до 20 літер."
            ]);
            exit;
        }

        if (!preg_match($surnamePattern, $last_name)) {
            echo json_encode([
                'success' => false,
                'message' => "Прізвище некоректне. Воно має починатися з великої літери й містити від 2 до 20 літер."
            ]);
            exit;
        }

        try {
            $birthdayDate = new DateTime($birthday);
            if ($birthdayDate < $minDate || $birthdayDate > $maxDate) {
                echo json_encode([
                    'success' => false,
                    'message' => "Дата має бути між 01.01.1900 і 31.12.2025"
                ]);
                exit;
            }
        } catch (Exception $e) {
            echo json_encode([
                'success' => false,
                'message' => "Невірний формат дати народження."
            ]);
            exit;
        }


        $model = new studentModel();

        if ($model->studentExists($first_name, $last_name, $birthday)) {
            echo json_encode([
                "success" => false,
                "message" => "Такий студент уже існує."
            ]);
            exit;
        }

        $student = $model->editStudentInTable($id, $group_name, $first_name, $last_name, $gender, $birthday);
        if($student){
            echo json_encode([
                'success' => true,
                'student' => $student
            ]);
        }
    }
} else if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['action']) && $_GET['action'] == 'deleteStudent'){
    session_start();

    $jsonData = file_get_contents('php://input'); // читаємо тіло запиту
    $data = json_decode($jsonData, true); // Перетворюємо JSON у асоціативний масив

    if(isset($data['ids'])) {
        $ids = $data['ids'];
        $model = new studentModel();
        $result = $model->deleteStudentsFromTable($ids);
        echo json_encode(["success" => true]);
        exit;
    }
    echo json_encode(["success" => false]);

} else if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['action']) && $_GET['action'] == 'getOnlineStudents') {
    session_start();

    $jsonData = file_get_contents('php://input'); // читаємо тіло запиту
    $data = json_decode($jsonData, true);

    if(isset($data['limit'], $data['offset'])) {
        $limit = $data['limit'];
        $offset = $data['offset'];

        $model = new studentModel();
        $onlineStudents = $model->getOnlineStudents($limit, $offset);

        echo json_encode([
            'success' => true,
            'students' => $onlineStudents
        ]);
    }
    exit;
} else if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['action']) && $_GET['action'] == 'isStudentExist') {
    session_start();

    $jsonData = file_get_contents('php://input'); // читаємо тіло запиту
    $data = json_decode($jsonData, true); // Перетворюємо JSON у асоціативний масив

    if(isset($data['first_name'], $data['last_name'], $data['birthday'])) {
        $first_name = $data['first_name'];
        $last_name = $data['last_name'];
        $birthday = $data['birthday'];

        $namePattern = '/^[A-Z][a-z]{0,18}(-[A-Z][a-z]*)?$/';
        $surnamePattern = '/^[A-Z][a-z]{1,19}$/';
        $minDate = new DateTime('1900-01-01');
        $maxDate = new DateTime('2025-12-31');

        if (!preg_match($namePattern, $first_name)) {
            echo json_encode([
                'success' => false,
                'message' => "Ім'я некоректне. Воно має починатися з великої літери й містити від 2 до 20 літер."
            ]);
            exit;
        }

        if (!preg_match($surnamePattern, $last_name)) {
            echo json_encode([
                'success' => false,
                'message' => "Прізвище некоректне. Воно має починатися з великої літери й містити від 2 до 20 літер."
            ]);
            exit;
        }

        try {
            $birthdayDate = new DateTime($birthday);
            if ($birthdayDate < $minDate || $birthdayDate > $maxDate) {
                echo json_encode([
                    'success' => false,
                    'message' => "Дата має бути між 01.01.1900 і 31.12.2025"
                ]);
                exit;
            }
        } catch (Exception $e) {
            echo json_encode([
                'success' => false,
                'message' => "Невірний формат дати народження."
            ]);
            exit;
        }


        $model = new studentModel();

        if ($model->studentExists($first_name, $last_name, $birthday)) {
            echo json_encode([
                "success" => true,
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Такого студента не існує в таблиці, ви не можете створити з ним чат!"
            ]);
        }
    }
}

