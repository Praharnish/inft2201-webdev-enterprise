<?php
use PHPUnit\Framework\TestCase;
use Application\Mail;

class MailTest extends TestCase {
    protected PDO $pdo;

    protected function setUp(): void
    {
        $dsn = "pgsql:host=" . getenv('DB_TEST_HOST') . ";dbname=" . getenv('DB_TEST_NAME');
        $this->pdo = new PDO($dsn, getenv('DB_USER'), getenv('DB_PASS'));
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Clean and reinitialize the table
        $this->pdo->exec("DROP TABLE IF EXISTS mail;");
        $this->pdo->exec("
            CREATE TABLE mail (
                id SERIAL PRIMARY KEY,
                subject TEXT NOT NULL,
                body TEXT NOT NULL
            );
        ");

        // Reset the sequence so IDs start at 1 for each test 
        $this->pdo->exec("ALTER SEQUENCE mail_id_seq RESTART WITH 1;");
    }

    // To test create mail
    public function testCreateMail() {
        $mail = new Mail($this->pdo);
        $id = $mail->createMail("Alice", "Hello world");
        $this->assertIsInt($id);
        $this->assertEquals(1, $id);
    }

    // To test get all mails
    public function testGetAllMails() {
        $mail = new Mail($this->pdo);
        $mail->createMail("Alice", "Hello! Good Morning.");
        $mail->createMail("Rocky", "Hey there! How are you doing?");

        $mails = $mail->getAllMails();
        $this->assertCount(2, $mails);
        $this->assertEquals("Alice", $mails[0]['subject']);
        $this->assertEquals("Hello! Good Morning.", $mails[0]['body']);
        $this->assertEquals("Rocky", $mails[1]['subject']);
        $this->assertEquals("Hey there! How are you doing?", $mails[1]['body']);
    }

    // To test get mail by id
    public function testgetMail() {
        $mail = new Mail($this->pdo);
        $id = $mail->createMail("Harnish", "Have a great day!");

        $returnedMail = $mail->getMail($id);
        $this->assertCount(1, $returnedMail);
        $this->assertEquals("Harnish", $returnedMail[0]['subject']);
        $this->assertEquals("Have a great day!", $returnedMail[0]['body']);
    }

    // To test update mail
    public function testUpdateMail() {
        $mail = new Mail($this->pdo);
        $id = $mail->createMail("Danna", "Hello World");

        $mail->updateMail($id, "John", "Welcome to the World!");

        $returnedMail = $mail->getMail($id);
        $this->assertCount(1, $returnedMail);
        $this->assertEquals("John", $returnedMail[0]['subject']);
        $this->assertEquals("Welcome to the World!", $returnedMail[0]['body']);
    }

    // To test delet mail
    public function testDeleteMail() {
        $mail = new Mail($this->pdo);
        $id = $mail->createMail("Trump", "Destroy the World");

        $result = $mail->deleteMail($id);
        $this->assertTrue($result);

        $deletedMail = $mail->getMail($id);
        $this->assertCount(0, $deletedMail);
    }
}