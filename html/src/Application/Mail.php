<?php
namespace Application;

use PDO;

class Mail {
    protected PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    // To create mail
    public function createMail($subject, $body) {
        $stmt = $this->pdo->prepare("INSERT INTO mail (subject, body) VALUES (?, ?) RETURNING id");
        $stmt->execute([$subject, $body]);

        return $stmt->fetchColumn();
    }

    // To review all mails
    public function getAllMails() : array {
        $sql = "SELECT * FROM mail ORDER BY id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);

    }

    // To review a mail with id
    public function getMailById($id) {
        $sql = "SELECT * FROM mail WHERE id=?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$id]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // To update a mail by id
    public function updateMail($id, $subject, $body) {
        $sql = "UPDATE mail SET subject = ?, body = ? WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$subject, $body, $id]);

        $updatedMail = $this->getMailById($id);
        return $updatedMail;
    }

     // To delete a mail
    public function deleteMail($id) {
        $sql = "DELETE FROM mail WHERE id=?";
        $stmt = $this->pdo->prepare($sql);

        return $stmt->execute([$id]);
    }
}