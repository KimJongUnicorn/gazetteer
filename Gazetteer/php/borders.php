<?php
    // ini_set('display_errors', 'On');
    // error_reporting(E_ALL);
    $executionStartTime = microtime(true);

    // get country border feature
    $countryBorders = json_decode(file_get_contents("../js/countryBorders.geo.json"), true);

    $border = null;
    $countrySelect= $_REQUEST['countrySelect'];

    foreach ($countryBorders['features'] as $feature) {
        
        if ($feature["properties"]["iso_a2"] == $countrySelect) {

            $border = $feature;
            break;
        }
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data']['border'] = $border;

     header('Content-Type: application/json; charset=UTF-8');
     echo json_encode($output);

 ?>