<?php

/*
URL Parameters
*/
$ALLOW_GET = true; //Allow HTTP GET requests (if disabled, will only return values for HTTP POST) TURN OFF IN PRODUCTION
$INS = 'ins'; //Check if user is in DB or not
$INS_PARAM = gp('ins', $ALLOW_GET);


require 'Medoo.php';
use Medoo\Medoo;

header('Content-Type: application/json');

$db = null;

try {
  //Production envorinment
  $db = new Medoo([
      'database_type' => 'mysql',
      'database_name' => 'id3039771_thinkfast',
      'server' => 'localhost',
      'username' => 'id3039771_admin',
      'password' => 'thinKFastZ152'
  ]);
} catch(Exception $e) {
  //Dev envorinment
  $db = new Medoo([
    'database_type' => 'mysql',
    'database_name' => 'id3039771_thinkfast',
    'server' => 'localhost',
    'username' => 'root',
    'password' => ''
  ]);
}



$p = $db->select('leaderboard', '*');
$resp = $p;

find_from_db($INS, $p, $ALLOW_GET, $db);

echo json_encode($resp);


function gp($param, $ALLOW_GET) {
  if(isset($_GET[$param]) && $ALLOW_GET == true) {
    return $_GET[$param];
  } elseif(isset($_POST[$param])) {
    return $_POST[$param];
  }/* else {
    return false;
  }*/
}

function find_from_db($INS, $p, $ALLOW_GET, $db) {
  $updated = false;
  $ins = gp('ins', $ALLOW_GET);
  $add = gp('add', $ALLOW_GET);
  if(isset($_GET[$INS])) {
    if($add > 0) {
      $upd = $db->update('leaderboard', [
        'score[+]' => $add
      ], [
        'name' => $ins
      ]);
      if($upd->rowCount() > 0) {
        $updated = true;
      }
    } else {
      http_response_code(400);
      die('`add` needs to be an integer that is above 0.');
    }
  }
  if($updated == false) {
    $db->insert('leaderboard', [
      'name' => $ins,
      'score' => $add
    ]);
  }
}
?>
