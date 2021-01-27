<?php
    // ini_set('display_errors', 'On');
    // error_reporting(E_ALL);
    $executionStartTime = microtime(true);

    // get country border feature
    $countryCapital = json_decode(file_get_contents("http://api.geonames.org/countryInfoJSON?&username=kimjongunicorn"), true);

    $border = null;
    

    foreach ($countryCapital['geonames'] as $feature) {
        
        if ($feature["countryCode"] == $_REQUEST["countrySelect"]) {

            $capital = $feature;
            break;
        }
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data']['border'] = $capital;

     header('Content-Type: application/json; charset=UTF-8');
     echo json_encode($output);

 ?>