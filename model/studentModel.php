<?php
require_once 'db_auth.php';
class studentModel {
    private $pdo;
    private $groupName;
    private $first_name;
    private $last_name;
    private $gender;
    private $birthday;

    public function __construct()
    {
        $this->pdo = getAuthPDO();
    }

    public function getAllStudent(): array {
        try {
            $sql = "SELECT * FROM students_info";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log($e->getMessage());
            return [];
        }
    }


    public function addStudentToTable(string $group, string $name, string $surname, string $gender,
                                      string $birthday): array {
        try {
            $sql = "INSERT INTO students_info (group_name, first_name, last_name, gender, birthday) VALUES (:group_name, :first_name, :last_name, :gender, :birthday)";
            $stmt = $this->pdo->prepare($sql);

            $stmt->execute([
                ':group_name' => $group,
                ':first_name' => $name,
                ':last_name' => $surname,
                ':gender' => $gender,
                ':birthday' => $birthday
            ]);
            return $this->getAllStudent();
        } catch (PDOException $e) {
            error_log($e->getMessage());
            return [];
        }
    }

    public function getStudentById(int $id): array {
        $stmt = $this->pdo->prepare("SELECT * FROM students_info WHERE id = :id");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function editStudentInTable(int $id, string $group, string $name, string $surname, string $gender,
                                       string $birthday): array {
        try{
            $sql = "UPDATE students_info
            SET group_name = :group_name, first_name = :first_name, 
                last_name = :last_name, gender = :gender, 
                birthday = :birthday, is_online = 0
                WHERE id = :id";

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                ':id' => $id,
                ':group_name' => $group,
                ':first_name' => $name,
                ':last_name' => $surname,
                ':gender' => $gender,
                ':birthday' => $birthday
            ]);
            if($stmt->rowCount() > 0){
                return $this->getStudentById($id);
            }
            return [];
        } catch (PDOException $e){
            error_log($e->getMessage());
            return [];
        }
    }

    public function deleteStudentsFromTable(array $ids): bool {
        try {
            $placeholders = implode(',', array_fill(0, count($ids), '?'));
            $sql = "DELETE FROM students_info WHERE id IN ($placeholders)";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($ids);
            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            error_log($e->getMessage());
            return false;
        }
    }

    public function studentExists($firstName, $lastName, $birthday): bool {
        $sql = "SELECT COUNT(*) FROM students_info WHERE first_name = :firstName AND last_name = :lastName AND birthday = :birthday";
        $stmt = $this->pdo->prepare($sql);

        $birthdayFormatted = (new DateTime($birthday))->format('Y-m-d');

        $stmt->execute([
            ':firstName' => $firstName,
            ':lastName' => $lastName,
            ':birthday' => $birthdayFormatted
        ]);
        return $stmt->fetchColumn() > 0;
    }

    public function getOnlineStudents() {
        try {
            $sqlUpdate = "UPDATE students_info 
                      SET is_online = 0 
                      WHERE last_active < NOW() - INTERVAL 1 MINUTE";
            $this->pdo->exec($sqlUpdate);

            $sql = "SELECT * FROM students_info WHERE is_online = 1 AND last_active >= NOW() - INTERVAL 1 MINUTE";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log($e->getMessage());
            return [];
        }
    }

}