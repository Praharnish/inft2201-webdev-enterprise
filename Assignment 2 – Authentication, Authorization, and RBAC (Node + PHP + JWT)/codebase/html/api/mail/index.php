<?php
require  __DIR__ . '/../../../autoload.php';

use Application\Mail;
use Application\Database;
use Application\Page;
use Application\Verifier;

$database = new Database('prod');
$page = new Page();

$mail = new Mail($database->getDb());

// AUTHORIZATION CHECK
if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
    http_response_code(401);
    echo json_encode(["error" => "Missing Authorization header"]);
    exit;
}

$authHeader = $_SERVER['HTTP_AUTHORIZATION'];

if (!str_starts_with($authHeader, "Bearer ")) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid Authorization format"]);
    exit;
}

$token = str_replace("Bearer ", "", $authHeader);

// VERIFY TOKEN
$verifier = new Verifier();

try {
    $verifier->decode($token);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid token"]);
    exit;
}

// POST → CREATE MAIL
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents('php://input'), true);

    if (array_key_exists('name', $data) && array_key_exists('message', $data)) {

        // RBAC: assign userId
        if ($verifier->role === "admin" && isset($data['userId'])) {
            $userId = $data['userId'];
        } else {
            $userId = $verifier->userId;
        }

        $id = $mail->createMail($data['name'], $data['message'], $userId);

        $page->item(["id" => $id]);

    } else {
        $page->badRequest();
    }

// GET → FETCH MAIL
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    // ✅ RBAC: filter mail
    if ($verifier->role === "admin") {
        $result = $mail->listMail(); // all mail
    } else {
        $result = $mail->listMailByUserId($verifier->userId); // only user's mail
    }

    $page->item($result);

} else {
    $page->badRequest();
}