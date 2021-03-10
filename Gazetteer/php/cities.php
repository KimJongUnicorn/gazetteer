<?php

    $executionStartTime = microtime(true) / 1000;

    $url="http://api.geonames.org/searchJSON?username=kimjongunicorn&country=" . $_REQUEST['country'] . "&featureCode=PPLA2&maxRows=20";
	
	$cityMarkers = ["type"=>"FeatureCollection","features"=>array()];
	$temp = [];
	$t = [];

	while ($row = mysqli_fetch_assoc($url)) {

		$t['properties']['name'] = $row['name'];
		$t['properties']['population'] = $row['population'];

		$t['type'] = "Feature";
		$t['geometry']['type'] = 'Point';
		$t['geometry']['coordinates'] = $row['lng'] + ',' + $row['lat'];				   

		array_push($temp, $t);

	}

	$cityMarkers['features'] = $temp;

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $cityMarkers;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>