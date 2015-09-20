<?php
$method = $_REQUEST["method"];
if(!$method) die("method missing\n");

// add access token
$_REQUEST["access_token"] = "cb25aafd9e657eeefe9ba16913f134c8ffcc691c";

// make request
$url = "https://api.spark.io/v1/devices/54ff6d066672524818311167" . "/" . $method . "?access_token=e5ea3c17b273092f7d5da9cb5c3411a24e3b5d76";
echo $response; 
?>