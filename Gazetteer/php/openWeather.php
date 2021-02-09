<?php

    $executionStartTime = microtime(true) / 1000;

	$url=json_decode(file_get_contents('http://api.openweathermap.org/data/2.5/weather?q=' . $REQUEST['capitalCity'] . '&appid=611d819c2369c4fdd14281938cc9bd7c'));

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $decode['data'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>