<?php

    $countriesJSON = file_get_contents("../js/countryBorders.geo.json");
    
    $countriesArray = json_decode($countriesJSON, true);
    $countries = $countriesArray['features'];
    
    $countriesList=array();
    $coordinates=array();
    $isoCodes=array();

    foreach ($countries as $country) {
        array_push($countriesList, $country['properties']['name']);
    }

    foreach ($countries as $country) {
        array_push($coordinates, $country['geometry']['coordinates']);
    }

    foreach ($countries as $country) {
        array_push($isoCodes, $country['properties']['iso_a3']);
    }

    //below is an array of iso codes and coordinates as key: value pairs
    $countriesCoords = array_combine ($isoCodes, $coordinates);
    //below is an array of iso codes and country names as key: value pairs
    $countriesNames = array_combine ($isoCodes, $countriesList);
    
?>
