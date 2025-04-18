<?php
require_once __DIR__ . '/../model/studentModel.php';
require_once __DIR__ . '/../model/authModel.php';

 if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['action']) && $_GET['action'] == 'login'){
     session_start();
    $jsonData = file_get_contents('php://input'); // читаємо тіло запиту
    $data = json_decode($jsonData, true); // Перетворюємо JSON у асоціативний масив

     if(isset($data['loginName'], $data['loginSurname'], $data['loginBirthday'])) {
         $loginName = $data['loginName'];
         $loginSurname = $data['loginSurname'];
         $loginBirthday = $data['loginBirthday'];

         $namePattern = '/^[A-Z][a-z]{0,18}(-[A-Z][a-z]*)?$/';
         $surnamePattern = '/^[A-Z][a-z]{1,19}$/';

         if (!preg_match($namePattern, $loginName)) {
             echo json_encode([
                 'success' => false,
                 'message' => "Ім'я некоректне. Воно має починатися з великої літери й містити від 2 до 20 літер."
             ]);
             exit;
         }

         if (!preg_match($surnamePattern, $loginSurname)) {
             echo json_encode([
                 'success' => false,
                 'message' => "Прізвище некоректне. Воно має починатися з великої літери й містити від 2 до 20 літер."
             ]);
             exit;
         }

         $model = new authModel();
         $studentLogin = $model->checkLogin($loginName, $loginSurname, $loginBirthday);

         if($studentLogin){
             try {
                 $_SESSION['token'] = bin2hex(random_bytes(32));
                 $_SESSION['loginName'] = $loginName;
                 $_SESSION['loginSurname'] = $loginSurname;
                 $response = [
                     'success' => true,
                 ];
             } catch (Exception $ex) {
                 http_response_code(500); // внутрішня помилка сервера
                 $response = [
                     'success' => false,
                     'message' => 'Token generation failed: ' . $e->getMessage()
                 ];
             }
             echo json_encode($response);
         } else {
             $response = [
                 'success' => false,
                 'message' => 'User is not found!'
             ];

             echo json_encode($response);
         }

     } else {
         // Якщо відсутні потрібні дані
         $response = [
             'success' => false,
             'message' => 'Missing required fields'
         ];

         echo json_encode($response);
     }
} else if($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['action']) && $_GET['action'] == 'session'){
     session_start();

     if(isset($_SESSION['loginName'], $_SESSION['loginSurname'])) {
         echo json_encode([
             'success' => true,
             'loginName' => $_SESSION['loginName'],
             'loginSurname' => $_SESSION['loginSurname']
         ]);
     } else {
         echo json_encode([
             'success' => false
         ]);
     }
 } else if($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['action']) && $_GET['action'] == 'sessionCheck'){
     session_start();

     if(isset($_SESSION['loginName'], $_SESSION['loginSurname'], $_SESSION['token'])) {
         echo json_encode([
             'success' => true,
             'loginName' => $_SESSION['loginName'],
             'loginSurname' => $_SESSION['loginSurname']
         ]);
     } else {
         echo json_encode([
             'success' => false
         ]);
     }
 } else if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['action']) && $_GET['action'] == 'logout'){
     session_start();
     session_unset();       // видаляє всі змінні сесії
     session_destroy();     // знищує саму сесію

     echo json_encode(['success' => true]);
 } else {
     http_response_code(405); // Метод не дозволений
     $response = [
         'success' => false,
         'message' => 'Method Not Allowed'
     ];
     echo json_encode($response);
 }