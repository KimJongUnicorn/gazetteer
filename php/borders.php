<?php
    $executionStartTime = microtime(true);

    $countryData = json_decode(file_get_contents("../js/countryBorders.geo.json"), true);

    $country = [];

    foreach ($countryData['features'] as $feature) {

        $temp = null;
        $temp['border'] = $feature["geometry"]['coordinates'];

        array_push($country, $temp);      

    }

    usort($country, function ($item1) {

        return $item1['border'];

    });

    $output['status']['border'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $country;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);

?>