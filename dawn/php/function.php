<?php
$method = $_REQUEST["method"];
if(!$method) die("method missing\n");

// make request
$url = "https://api.spark.io/v1/devices/54ff6d066672524818311167" . "/" . $method . "?access_token=e5ea3c17b273092f7d5da9cb5c3411a24e3b5d76";
$response = file_get_contents($url);
echo $response; 
?>
