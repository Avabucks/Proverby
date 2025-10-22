<?php
include "config/config.php";

if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origin = $_SERVER['HTTP_ORIGIN'];

    // Estrarre solo schema + host senza porta
    $parsed = parse_url($origin);
    $origin_base = $parsed['scheme'] . '://' . $parsed['host'];

    if (in_array($origin_base, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    }
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

echo "funziona";
?>