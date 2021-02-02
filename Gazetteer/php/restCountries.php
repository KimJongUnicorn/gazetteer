<?php
    // ini_set('display_errors', 'On');
    // error_reporting(E_ALL);
    $executionStartTime = microtime(true);

    // get country border feature
    $restCountries = json_decode(file_get_contents("https://restcountries.eu/rest/v2/all"), true);

    $border = null;
    

    foreach ($restCountries as $feature) {
        
        if ($feature["alpha2Code"] == $_REQUEST["countrySelect"]) {

            $country = $feature;
            break;
        }
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data']['border'] = $country;

     header('Content-Type: application/json; charset=UTF-8');
     echo json_encode($output);

 ?>