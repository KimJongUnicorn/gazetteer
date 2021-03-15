<?php

    $executionStartTime = microtime(true) / 1000;

    $url = json_decode(file_get_contents("http://api.geonames.org/searchJSON?username=kimjongunicorn&country=" . $_REQUEST['country'] . "&featureCode=LK&maxRows=15"), true);
	
	$lakeMarkers = ["type"=>"FeatureCollection","features"=>array()];
	$temp = [];
	$t = [];

	$data = $url['geonames'];

	foreach ($data as $lake) {

		$wikiString = 'en.wikipedia.org/wiki/';

		$t['properties']['name'] = $lake['name'];
		$t['properties']['population'] = $lake['population'];
		$t['properties']['wiki'] = $wikiString . $lake['name'];

		$t['type'] = 'Feature';
		$t['geometry']['type'] = 'Point';
      	$lat = $lake['lat'];
      	$lng = $lake['lng'];
		$t['geometry']['coordinates'][0] = floatval($lng);
      	$t['geometry']['coordinates'][1] = floatval($lat);

		$url2="https://commons.wikimedia.org/w/api.php?format=json&action=query&generator=geosearch&ggsprimary=all&ggsnamespace=6&ggsradius=1000&ggscoord=" . floatval($lat) . "|" . floatval($lng) . "&ggslimit=3&prop=imageinfo&iilimit=1&iiprop=url&iiurlwidth=200&iiurlheight=200";
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_URL,$url2);

		$result=curl_exec($ch);

		curl_close($ch);

		$decode = json_decode($result,true);	
		$pageID = array_keys($decode['query']['pages'])[0];

		$t['properties']['photo'] = $decode['query']['pages'][$pageID]['imageinfo'][0]['responsiveUrls'][2];

		array_push($temp, $t);

	} 

	$lakeMarkers['features'] = $temp;

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $lakeMarkers;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
	

?>