<?php
require_once 'db_auth.php';
class authModel
{
    private $pdo;

    public function __construct()
    {
        $this->pdo = getAuthPDO();
    }
    public function checkLogin($first_name, $last_name, $birthday): bool
    {
        $sql = "SELECT * FROM students WHERE first_name = :first_name AND last_name = :last_name AND birthday = :birthday LIMIT 1";

        // Підготовка запиту
        $stmt = $this->pdo->prepare($sql);

        $stmt->bindParam(':first_name', $first_name);
        $stmt->bindParam(':last_name', $last_name);
        $stmt->bindParam(':birthday', $birthday);

        // Виконання запиту
        $stmt->execute();

        // Перевірка, чи знайдений студент
        if ($stmt->rowCount() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function updateStudentOnlineStatusByPersonalData($firstName, $lastName, $birthday, $isOnline) {
        try {
            $sql = "UPDATE students_info 
                SET is_online = :is_online, last_active = NOW() 
                WHERE first_name = :first_name 
                  AND last_name = :last_name 
                  AND birthday = :birth_date";

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                ':first_name' => $firstName,
                ':last_name' => $lastName,
                ':birth_date' => $birthday,
                ':is_online' => $isOnline
            ]);
        } catch (PDOException $e) {
            error_log("updateStudentOnlineStatusByPersonalData error: " . $e->getMessage());
        }
    }

}