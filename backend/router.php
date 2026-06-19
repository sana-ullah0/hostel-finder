<?php
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$filename = __DIR__ . $uri;

if ($uri !== '/' && file_exists($filename) && is_file($filename)) {
    return false;
}

require_once __DIR__ . '/index.php';
