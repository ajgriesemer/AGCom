<?php
$method = $_REQUEST["method"];
if(!$method) die("device or method param missing\n");

// add access token
$_REQUEST["access_token"] = "12399....123123";

// create params
$params = http_build_query($_REQUEST);

// make request
$url = "https://api.spark.io/v1/devices/54ff6d066672524818311167/" . $method . "?" . $params;
$response = file_get_contents($url);
echo $response; 
?>