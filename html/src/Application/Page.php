<?php
namespace Application;

class Page {
    // For getting all mails
    public function list($items) {
        try {
            if (is_array($items) && count($items) === 0) {
                http_response_code(200);
                echo json_encode(["message" => "No mails yet!"]);
                return;
            }
                http_response_code(200);
                echo json_encode($items);
        } catch (\Exception $e){
            http_response_code(500);
            echo json_encode(["error" => "Failed to encode JSON"]);
        }
    }

    // To modify the mails
    public function item($item) {
        try {
            if (is_array($item) && count($item) === 0) {
                http_response_code(404);
                echo json_encode(["error" => "Mail not found"]);
                return;
            }
                http_response_code(200);
                echo json_encode($item);
        } catch (\Exception $e){
            http_response_code(500);
            echo json_encode(["error" => "Failed to encode JSON"]);
        }
    }

    // To create mail
    public function itemCreate($item) {
        try {
            if (is_array($item) && count($item) === 0) {
                http_response_code(404);
                echo json_encode(["error" => "Mail not found"]);
                return;
            }
                http_response_code(201);
                echo json_encode($item);
        } catch (\Exception $e){
            http_response_code(500);
            echo json_encode(["error" => "Failed to encode JSON"]);
        }
    }

    // if the data not found
    public function notFound() {
        http_response_code(404);
        echo json_encode(["error" => "Not found"]);
    }

    // for bad re4quest
    public function badRequest() {
        http_response_code(400);
        echo json_encode(["error" => "Bad request"]);
    }
}