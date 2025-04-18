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
}