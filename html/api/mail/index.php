<!-- 
Auther: Harnish Prajapati
Purpose: Greating api for creating and getting all the mails.
-->

<?php
require '../../vendor/autoload.php';

use Application\Mail;
use Application\Page;

$dsn = "pgsql:host=" . getenv('DB_PROD_HOST') . ";dbname=" . getenv('DB_PROD_NAME');
try {
    $pdo = new PDO($dsn, getenv('DB_USER'), getenv('DB_PASS'), [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo "Database connection failed: " . $e->getMessage();
    exit;
}

$mail = new Mail($pdo);
$page = new Page();

// Chatgpt
// To get the url
$uri = $_SERVER['REQUEST_URI'];

// To get the method
$method = $_SERVER['REQUEST_METHOD'];

if ($uri === "/api/mail/") {
    switch ($method) {
        // GET all mails
        case 'GET':
            $page->list($mail->getAllMails());
            break;

        // Create a mail
        case 'POST':
            $json = file_get_contents("php://input");
            $data = json_decode($json, true);
            $page->itemCreate($mail->createMail($data['subject'], $data['body']));
            break;
            
        // Default condition
        default:
            $page->notFound();
    }
};