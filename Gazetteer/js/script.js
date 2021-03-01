//CREATING THE MAP
var attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
var mapView = "https://api.mapbox.com/styles/v1/kimjongunicorn/ckkwhczan4wvp17qdv7szufka/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2ltam9uZ3VuaWNvcm4iLCJhIjoiY2tqeWV6MXV2MGI3YzJvbzJkenl0ZXl2bSJ9.r56ig_YevLwVREuhe6HhlA";
var satelliteView = "https://api.mapbox.com/styles/v1/kimjongunicorn/ckkwi086k0poi17littcd0z4n/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2ltam9uZ3VuaWNvcm4iLCJhIjoiY2tqeWV6MXV2MGI3YzJvbzJkenl0ZXl2bSJ9.r56ig_YevLwVREuhe6HhlA";

var baseMaps = {
    "Map": mapView,
    "Satellite": satelliteView
};

var mymap = L.map('mapid',{ zoomControl: false }).setView([53.100, -1.785], 5.75); 

var tiles = L.tileLayer(mapView, { attribution });
tiles.addTo(mymap);


//FUNCTION - FORMAT POPULATION TO BE MORE READABLE - TO BE USED LATER
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

$('#countryInfoButton').click(function() {
    $('#info_text').toggle();
});

$('#weatherInfoButton').click(function() {
    $('#weather_text').toggle();
});


//AJAX CALLS
//POPULATING THE DROP DOWN
$(document).ready(function () {

    $.ajax({
        url: "php/dropdown.php",
        type: 'POST',
        dataType: 'json',
    
        success: function(result) {

            console.log(result);

            if (result.status.name == "ok") {

                $('#countrySelect').html('');

                $.each(result.data, function(index) {

                    $('#countrySelect').append($('<option>',{
                        value: result.data[index].code,
                        text: result.data[index].name
                    }));                    
                 });  

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 


});
//ADDING COUNTRY BORDER ON SELECT
$('#countrySelect').change(function() {

    $.ajax({
        url: "php/borders.php",
        type: 'POST',
        dataType: 'json',
        data: {
            countrySelect: $('#countrySelect').val()
        },

        success: function(result) {

            console.log(result);

            if (result.status.name == "ok") {

                mymap.remove();
                mymap = L.map('mapid',{ zoomControl: false }).setView([53.100, -1.785], 5.75); 
                tiles.addTo(mymap);

                                //ADDING THE INFO TEXT BOX
                L.Control.textbox = L.Control.extend({
                    onAdd: function(mymap) {
                        
                    var text = L.DomUtil.create('div');
                    text.id = "info_text";
                    text.innerHTML = "<h4>Country Information<h4><hr><p id='capitalCity'>Capital City: </p><p id='continent'>Continent: </p><p id='demonym'>Demonym: </p><p id='language'>Majority Language: </p><p id='population'>Population: </p><p id='currency'>Currency: </p><div id='flag'></div>";
                    return text;
                    },

                    onRemove: function(mymap) {
                        // Nothing to do here
                    }
                });
                L.control.textbox = function(opts) { return new L.Control.textbox(opts);}
                L.control.textbox({ position: 'topright' }).addTo(mymap);


                //ADDING THE WEATHER BOX
                L.Control.textbox = L.Control.extend({
                    onAdd: function(mymap) {
                        
                    var text = L.DomUtil.create('div');
                    text.id = "weather_text";
                    text.innerHTML = "<h4 id='weather'>Weather</h4><hr><table><tr><td id='icon'></td><td id='temp'></td><td>|</td><td id='tempF'></td></tr></table><p id='weatherDesc'></p><p id='humidity'></p><p id='wind'></p>";
                    return text;
                    },

                    onRemove: function(mymap) {
                        // Nothing to do here
                    }
                });
                L.control.textbox = function(opts) { return new L.Control.textbox(opts);}
                L.control.textbox({ position: 'topright' }).addTo(mymap);


                var geoJsonLayer = null;
                var featureGroup = L.featureGroup();

                mygeoJson = result.data.border;
                

                var myStyle = {
                    "color": "#e4a677",
                    "weight": 3,
                    "opacity": 1
                };

                geoJsonLayer = L.geoJson(mygeoJson, {
                    style: myStyle
                });

                featureGroup.addLayer(geoJsonLayer);
                featureGroup.addTo(mymap);

                mymap.fitBounds(featureGroup.getBounds());

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 


});

//CODE TO LOAD THE USER'S COUNTRY
$(document).ready(function () {

    $.ajax({
        url: "php/borders.php",
        type: 'POST',
        dataType: 'json',
        data: {
            countrySelect: $('#countrySelect').val()
        },

        success: function(result) {

            console.log(result);

            if (result.status.name == "ok") {
               
                fetch('https://extreme-ip-lookup.com/json/')
                .then( res => res.json())
                .then(response => {
                    var userCountry = (response.countryCode);
                    $('#countrySelect').val(userCountry).change();;
               })
               .catch((data, status) => {
                   console.log('Request failed');
               })

                var geoJsonLayer = null;
                var featureGroup = L.featureGroup();

                var initialGeoJson = result.data.border;
                
                var myStyle = {
                    "color": "#e4a677",
                    "weight": 3,
                    "opacity": 0.4
                };

                geoJsonLayer = L.geoJson(initialGeoJson, {
                    style: myStyle
                });

                featureGroup.addLayer(geoJsonLayer);
                featureGroup.addTo(mymap);
                
                
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 


});

//ADDING COUNTRY INFO - GEONAMES

var newCapital = "";
var photoCountry = "";
var newPhotoCountry = "";
var newCountryCode = "";

var capitalLat = "";
var capitalLng = "";
var capitalImage = "";

$('#countrySelect').change(function() {

    $.ajax({
        url: "php/getCountryInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            countrySelect: $('#countrySelect').val()
        },

        success: function(result) {

            console.log(result);

            if (result.status.name == "ok") {
                
                newCapital = result.data.border.capital;
                photoCountry = result.data.border.countryName;           
                newPhotoCountry = photoCountry.replace(/ /g, "%20");
                newCountryCode = result.data.border.countryCode;
                var newContinent = result.data.border.continentName;
                var newPopulation = result.data.border.population;


                $('#capitalCity').html("Capital City: " + newCapital);
                $('#continent').html("Continent: " + newContinent);
                $('#population').html("Population: " + formatNumber(newPopulation));
                $('#weather').html("Current Weather in " + newCapital);   
                
                //WEATHER API
                $.ajax({
                    url: "php/openWeather.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        capital: newCapital
                    },
            
                    success: function(result) {
            
                        console.log(result);
            
                        if (result.status.name == "ok") {

                            console.log(result.data.weather[0].icon);

                            var weatherInC = Math.round(result.data.main.temp - 272.15);
                            var weatherInF = Math.round(result.data.main.temp * 1.8 - 459.67);
                            var iconCode = result.data.weather[0].icon;
                            var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
                            var wDescription = result.data.weather[0].description;
                            var humidity = result.data.main.humidity;
                            var wind = result.data.wind.speed * 3.6;

                            $('#temp').html(weatherInC + '&#176C');
                            $('#tempF').html(weatherInF + '&#176F');
                            $('#icon').html('<img src ="' + iconUrl + '" ' + 'width="40px">');
                            $('#weatherDesc').html(wDescription.charAt(0).toUpperCase() + wDescription.slice(1));
                            $('#humidity').html('Humidity: ' + humidity + '%');
                            $('#wind').html('Wind: ' + Math.round(wind) + ' KMPH');
                         
                        }
                    
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        // your error code
                    }
                });
                
                //WIKIPEDIA API
                $.ajax({
                    url: "php/wiki.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        capital: newCapital
                    },
            
                    success: function(result) {
            
                        console.log(result);
            
                        if (result.status.name == "ok") {

                            var wikiLink = null;

                            if (result.data[1].countryCode == 'GB') {
                                capitalLat = result.data[1].lat;
                                capitalLng = result.data[1].lng;
                                wikiLink = result.data[1].wikipediaUrl;
                            } else {
                                capitalLat = result.data[0].lat;
                                capitalLng = result.data[0].lng;
                                wikiLink = result.data[0].wikipediaUrl;
                            }

                                $.ajax({
                                    url: "php/wikiPhoto.php",
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        lat: capitalLat,
                                        lng: capitalLng
                                    },
                            
                                    success: function(result) {
                            
                                        console.log(result);
                            
                                        if (result.status.name == "ok") {
                
                                            capitalImage = result.data.imageinfo[0].responsiveUrls[2];
                                            console.log(capitalImage);

                                            var capitalMarker = L.AwesomeMarkers.icon({
                                                icon: 'star',
                                                markerColor: 'orange',
                                                prefix: 'fa',
                                                iconColor: 'white'
                                            });
                
                                            L.marker([capitalLat, capitalLng], {icon: capitalMarker}).addTo(mymap)
                                                .bindPopup(`<a href='http://${wikiLink}' target='_blank'>${newCapital}</a>, capital city of ${photoCountry}.<br><img src='${capitalImage}' width='300px'/>`);
                                         
                                        }
                                    
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        // your error code
                                    }
                                });
                                

                         
                        }
                    
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        // your error code
                    }
                });



                //ADDING IN LARGE CITIES
                $.ajax({
                    url: "php/cities.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        country: newCountryCode
                    },
            
                    success: function(result) {
            
                        console.log(result);
            
                        if (result.status.name == "ok") {
                            
                            var cities = result.data;

                            cities.forEach(function(city) {
                                var cityLat = city.lat;
                                var cityLng = city.lng;
                                var cityName = city.name;
                                var cityPop = city.population;

                                var cityMarker = L.AwesomeMarkers.icon({
                                    icon: 'city',
                                    markerColor: 'red',
                                    prefix: 'fa',
                                    iconColor: 'white'
                                });

                                var cityImage = "";

                                

                                $.ajax({
                                    url: "php/wikiPhoto.php",
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        lat: cityLat,
                                        lng: cityLng
                                    },
                            
                                    success: function(result) {
                            
                                        if (result.status.name == "ok") {                                           

                                                cityImage = result.data.imageinfo[0].responsiveUrls[2];
                                                L.marker([cityLat, cityLng], {icon: cityMarker}).addTo(mymap)
                                                .bindPopup(`${cityName}, population: ${formatNumber(cityPop)}.<br><img src='${cityImage}' width='300px'/>`);                                            
                                    
                                        }
                                    
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        // your error code
                                    }
                                });
                            
                            });
                        }
                    
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        // your error code
                    }
                }); 
                //ADDING LAKES
                $.ajax({
                    url: "php/lakes.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        country: newCountryCode
                    },
            
                    success: function(result) {
            
                        console.log(result);
            
                        if (result.status.name == "ok") {
                            
                            var lakes = result.data;

                            lakes.forEach(function(lake) {
                                var lakeLat = lake.lat;
                                var lakeLng = lake.lng;
                                var lakeName = lake.name;

                                var lakeMarker = L.AwesomeMarkers.icon({
                                    icon: 'water',
                                    markerColor: 'darkblue',
                                    prefix: 'fa',
                                    iconColor: 'white'
                                });

                                var lakeImage = "";

                                $.ajax({
                                    url: "php/wikiPhoto.php",
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        lat: lakeLat,
                                        lng: lakeLng
                                    },
                            
                                    success: function(result) {
                            
                                        if (result.status.name == "ok") {                                           

                                                lakeImage = result.data.imageinfo[0].responsiveUrls[2];

                                                L.marker([lakeLat, lakeLng], {icon: lakeMarker}).addTo(mymap)
                                                .bindPopup(`${lakeName}.<br><img src='${lakeImage}' width='300px'/>`);                                            
                                    
                                        }
                                    
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        // your error code
                                    }
                                });
                            
                            });
                        }
                    
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        // your error code
                    }
                });
                //ADDING NATIONAL PARKS
                $.ajax({
                    url: "php/nationalParks.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        country: newCountryCode
                    },
            
                    success: function(result) {
            
                        console.log(result);
            
                        if (result.status.name == "ok") {
                            
                            var parks = result.data;

                            parks.forEach(function(park) {
                                var parkLat = park.lat;
                                var parkLng = park.lng;
                                var parkName = park.name;

                                
                                    var parkMarker = L.AwesomeMarkers.icon({
                                        icon: 'tree',
                                        markerColor: 'green',
                                        prefix: 'fa',
                                        iconColor: 'white'
                                    });
                                

                                var parkImage = "";

                                    $.ajax({
                                        url: "php/wikiPhoto.php",
                                        type: 'POST',
                                        dataType: 'json',
                                        data: {
                                            lat: parkLat,
                                            lng: parkLng
                                        },
                                
                                        success: function(result) {
                                
                                            if (result.status.name == "ok") {                                           
    
                                                    parkImage = result.data.imageinfo[0].responsiveUrls[2];
    
                                                    L.marker([parkLat, parkLng], {icon: parkMarker}).addTo(mymap)
                                                    .bindPopup(`${parkName}.<br><img src='${parkImage}' width='300px'/>`);                                            
                                        
                                            }
                                        
                                        },
                                        error: function(jqXHR, textStatus, errorThrown) {
                                            // your error code
                                        }
                                    });
                            });
                        }
                    
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        // your error code
                    }
                });
                
                //ADDING IN MOUNTAINS
                $.ajax({
                    url: "php/mountains.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        country: newCountryCode
                    },
            
                    success: function(result) {
            
                        console.log(result);
            
                        if (result.status.name == "ok") {
                            
                            var mountains = result.data;

                            mountains.forEach(function(mountain) {
                                var mountainLat = mountain.lat;
                                var mountainLng = mountain.lng;
                                var mountainName = mountain.name;

                        
                                var mountainMarker = L.AwesomeMarkers.icon({
                                    icon: 'mountain',
                                    markerColor: 'gray',
                                    prefix: 'fa',
                                    iconColor: 'white'
                                });

                                var mountainImage = "";

                                $.ajax({
                                    url: "php/wikiPhoto.php",
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        lat: mountainLat,
                                        lng: mountainLng
                                    },
                            
                                    success: function(result) {
                            
                                        if (result.status.name == "ok") {                                           

                                            mountainImage = result.data.imageinfo[0].responsiveUrls[2];

                                                L.marker([mountainLat, mountainLng], {icon: mountainMarker}).addTo(mymap)
                                                .bindPopup(`${mountainName}.<br><img src='${mountainImage}' width='300px'/>`);                                            
                                    
                                        }
                                    
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        // your error code
                                    }
                                });
                                
                            });
                        }
                    
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        // your error code
                    }
                });
            
                
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 


});
//ADDING COUNTRY INFO - RESTCOUNTRIES
$('#countrySelect').change(function() {

    $.ajax({
        url: "php/restCountries.php",
        type: 'POST',
        dataType: 'json',
        data: {
            countrySelect: $('#countrySelect').val()
        },

        success: function(result) {

            console.log(result);

            if (result.status.name == "ok") {
                
                var newDemonym = result.data.border.demonym;
                var newCurrency = result.data.border.currencies[0].name;
                var newCurrencySymbol = result.data.border.currencies[0].symbol;
                var newFlag = result.data.border.flag;
                var newLanguage = result.data.border.languages[0].name;
                photoCountry = result.data.border.name;
                

                
                $('#demonym').html("Demonym: " + newDemonym);
                $('#currency').html("Currency: " + newCurrency + "(" + newCurrencySymbol + ")");
                $('#flag').html('<img src ="' + newFlag + '" ' + 'width="250px">');
                $('#language').html("Majority Language: " + newLanguage);
               

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 


});



