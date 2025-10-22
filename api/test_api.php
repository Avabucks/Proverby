<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

$allowed_ips = ['127.0.0.1', '::1', '192.168.56.1']; // TODO manca IP server

if (!in_array($_SERVER['REMOTE_ADDR'], $allowed_ips)) {
    http_response_code(403);
    exit('Accesso negato');
}

echo "funziona";
?>