<?php
function getAuthPDO()
{
    $host = 'localhost';
    $dbname = 'student_portal';
    $username = 'root';
    $password = '#*#C?_r_P/6';

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        die("Auth DB connection failed: " . $e->getMessage());
    }
}