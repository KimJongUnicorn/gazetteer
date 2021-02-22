<?php

    $executionStartTime = microtime(true) / 1000;

    $url="https://commons.wikimedia.org/w/api.php?format=json&action=query&generator=geosearch&ggsprimary=all&ggsnamespace=6&ggsradius=500&ggscoord=" . $_REQUEST['lat'] . "|" . $_REQUEST['lng'] . "&ggslimit=3&prop=imageinfo&iilimit=1&iiprop=url&iiurlwidth=200&iiurlheight=200";

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	
	$pageID = array_keys($decode['query']['pages'])[0];

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $decode['query']['pages'][$pageID];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>