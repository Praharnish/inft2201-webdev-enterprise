<?php
namespace Application;

use PDO;

class Mail
{
    protected $db;

    public function __construct($db) {
        $this->db = $db;
    }

    // CREATE MAIL WITH userId
    public function createMail($name, $message, $userId)
    {
        $stmt = $this->db->prepare(
            "INSERT INTO mail (name, message, userId) VALUES (:name, :message, :userId)"
        );

        $stmt->execute([
            'name' => $name,
            'message' => $message,
            'userId' => $userId
        ]);

        return $this->db->lastInsertId();
    }

    // ADMIN → GET ALL MAIL
    public function listMail() 
    {
        $stmt = $this->db->query(
            "SELECT id, name, message, userId FROM mail ORDER BY id"
        );

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // USER → GET ONLY THEIR MAIL
    public function listMailByUserId($userId)
    {
        $stmt = $this->db->prepare(
            "SELECT id, name, message, userId FROM mail WHERE userId = :userId ORDER BY id"
        );

        $stmt->execute(['userId' => $userId]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}