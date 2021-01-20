<?php

    $countriesJSON = file_get_contents("../js/countryBorders.geo.json");
    
    $countriesArray = json_decode($countriesJSON, true);
    $countries = $countriesArray['features'];
    
    $countriesList=array();
    $coordinates=array();

    foreach ($countries as $country) {
        array_push($countriesList, $country['properties']['name']);
    }

    foreach ($countries as $country) {
        array_push($coordinates, $country['geometry']['coordinates']);
    }

    $countriesCoords = array_combine ($countriesList, $coordinates);
    
?>
