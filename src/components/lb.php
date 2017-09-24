<?php
require 'Medoo.php';
use Medoo\Medoo;

$database = new Medoo([
    'database_type' => 'mysql',
    'database_name' => 'thinkfast',
    'server' => 'localhost',
    'username' => 'root',
    'password' => ''
]);
$db = $database;

echo json_encode($db->select('leaderboard', ['*']))
?>
