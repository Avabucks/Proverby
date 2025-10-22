<?php
if ($_SERVER['REMOTE_ADDR'] !== '127.0.0.1') {
    http_response_code(403);
    exit('Accesso negato');
}

echo "funziona";
?>