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

$('#newsButton').click(function() {
    $('#news_text').toggle();
});

$('#musicButton').click(function() {
    $('#anthem_text').toggle();
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

                //ADDING THE NEWS BOX
                L.Control.textbox = L.Control.extend({
                    onAdd: function(mymap) {
                        
                    var text = L.DomUtil.create('div');
                    text.id = "news_text";
                    text.innerHTML = "<h4>Current Headlines<h4><br><h5 id='article1'></h5><h6 id='author1'></h6><h5 id='article2'></h5><h6 id='author2'></h6><h5 id='article3'></h5><h6 id='author3'></h6><h5 id='article4'></h5><h6 id='author4'></h6><h5 id='article5'></h5><h6 id='author5'></h6>";
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

                //ADDING THE MUSIC BOX
                L.Control.textbox = L.Control.extend({
                    onAdd: function(mymap) {
                        
                    var text = L.DomUtil.create('div');
                    text.id = "anthem_text";
                    text.innerHTML = "<div id='anthem'></div>";
                    return text;
                    },

                    onRemove: function(mymap) {
                        // Nothing to do here
                    }
                });
                L.control.textbox = function(opts) { return new L.Control.textbox(opts);}
                L.control.textbox({ position: 'bottomleft' }).addTo(mymap);


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

var newCapital = "";
var photoCountry = "";
var newPhotoCountry = "";
var newCountryCode = "";

var capitalLat = "";
var capitalLng = "";
var capitalImage = "";

$.fn.preload = function() {
    this.each(function(){
        $('<img/>')[0].src = this;
    });
}

//ADDING COUNTRY INFO - GEONAMES

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
                if (photoCountry == 'United Kingdom') {
                    photoCountry = 'Britain';
                }           
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

                //NEWS API
                $.ajax({
                    url: "php/news.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        country: photoCountry
                    },
            
                    success: function(result) {
            
                        console.log(result);
            
                        if (result.status.name == "ok") {
                            var article1Title = result.data.articles[0].title;
                            var article2Title = result.data.articles[1].title;
                            var article3Title = result.data.articles[2].title;
                            var article4Title = result.data.articles[3].title;
                            var article5Title = result.data.articles[4].title;

                            var article1Link = result.data.articles[0].url;
                            var article2Link = result.data.articles[1].url;
                            var article3Link = result.data.articles[2].url;
                            var article4Link = result.data.articles[3].url;
                            var article5Link = result.data.articles[4].url;

                            var article1Author = result.data.articles[0].author;
                            var article2Author = result.data.articles[1].author;
                            var article3Author = result.data.articles[2].author;
                            var article4Author = result.data.articles[3].author;
                            var article5Author = result.data.articles[4].author;

                            var article1Source = result.data.articles[0].source.name;
                            var article2Source = result.data.articles[1].source.name;
                            var article3Source = result.data.articles[2].source.name;
                            var article4Source = result.data.articles[3].source.name;
                            var article5Source = result.data.articles[4].source.name;
                        
                            $('#article1').html(`<a href=${article1Link} target="_blank">${article1Title}</a>`);
                            $('#author1').html(article1Author + ', ' + article1Source);

                            $('#article2').html(`<a href=${article2Link} target="_blank">${article2Title}</a>`);
                            $('#author2').html(article2Author + ', ' + article2Source);

                            $('#article3').html(`<a href=${article3Link} target="_blank">${article3Title}</a>`);
                            $('#author3').html(article3Author + ', ' + article3Source);

                            $('#article4').html(`<a href=${article4Link} target="_blank">${article4Title}</a>`);
                            $('#author4').html(article4Author + ', ' + article4Source);

                            $('#article5').html(`<a href=${article5Link} target="_blank">${article5Title}</a>`);
                            $('#author5').html(article5Author + ', ' + article5Source);
                         
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
                                            $([capitalImage]).preload();

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
                                var newCityName = cityName.replace(/ /g, "%20");
                                var cityPop = city.population;

                                var cityMarker = L.AwesomeMarkers.icon({
                                    icon: 'city',
                                    markerColor: 'red',
                                    prefix: 'fa',
                                    iconColor: 'white'
                                });

                                var cityImage = "";
                                var cityWiki = "";

                                $.ajax({
                                    url: "php/wiki.php",
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        capital: newCityName,
                                    },
                            
                                    success: function(result) {
                            
                                        if (result.status.name == "ok") {                                           
                                        
                                            if (result.data[0] == undefined) {
                                                cityWiki = "https://en.wikipedia.org/wiki/City";
                                            } else {
                                                cityWiki = result.data[0].wikipediaUrl;
                                            }                                             
                                    
                                        }
                                    
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        // your error code
                                    }
                                });

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

                                                if (result.data == undefined) {
                                                    cityImage = "./icons/city_icon.png";
                                                } else {
                                                    cityImage = result.data.imageinfo[0].responsiveUrls[2];
                                                }
                                          
                                                $([cityImage]).preload();
                                
                                                L.marker([cityLat, cityLng], {icon: cityMarker}).addTo(mymap)
                                                .bindPopup(`<a href='http://${cityWiki}' target='_blank'>${cityName}</a>, population: ${formatNumber(cityPop)}.<br><img src='${cityImage}' width='300px'/>`);
                                               
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
                                var newLakeName = lakeName.replace(/ /g, "%20");

                                var lakeMarker = L.AwesomeMarkers.icon({
                                    icon: 'water',
                                    markerColor: 'darkblue',
                                    prefix: 'fa',
                                    iconColor: 'white'
                                });

                                var lakeImage = "";
                                var lakeWiki = "";

                                $.ajax({
                                    url: "php/wiki.php",
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        capital: newLakeName,
                                    },
                            
                                    success: function(result) {
                            
                                        if (result.status.name == "ok") {                                           
                                        
                                            if (result.data[0] == undefined) {
                                                lakeWiki = "https://en.wikipedia.org/wiki/Lake";
                                            } else {
                                                lakeWiki = result.data[0].wikipediaUrl;
                                            }                                   
                                        }
                                    
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        // your error code
                                    }
                                });

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

                                                if (result.data == undefined) {
                                                    lakeImage = "./icons/orion_sailing.png";
                                                } else {
                                                    lakeImage = result.data.imageinfo[0].responsiveUrls[2];
                                                }
                                          
                                                $([lakeImage]).preload();

                                                L.marker([lakeLat, lakeLng], {icon: lakeMarker}).addTo(mymap)
                                                .bindPopup(`<a href='http://${lakeWiki}' target='_blank'>${lakeName}</a>.<br><img src='${lakeImage}' width='300px'/>`);
                                    
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
                                var newParkName = parkName.replace(/ /g, "%20");
                                
                                    var parkMarker = L.AwesomeMarkers.icon({
                                        icon: 'tree',
                                        markerColor: 'green',
                                        prefix: 'fa',
                                        iconColor: 'white'
                                    });
                                

                                var parkImage = "";
                                var parkWiki = "";

                                $.ajax({
                                    url: "php/wiki.php",
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        capital: newParkName,
                                    },
                            
                                    success: function(result) {
                            
                                        if (result.status.name == "ok") {                                           
                                        
                                            if (result.data[0] == undefined) {
                                                parkWiki = "https://en.wikipedia.org/wiki/Park";
                                            } else {
                                                parkWiki = result.data[0].wikipediaUrl;
                                            }                                   
                                        }
                                    
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        // your error code
                                    }
                                });
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
    
                                                    if (result.data == undefined) {
                                                        parkImage = "./icons/park_icon.png";
                                                    } else {
                                                        parkImage = result.data.imageinfo[0].responsiveUrls[2];
                                                    }
                                              
                                                    $([parkImage]).preload();
    
                                                    L.marker([parkLat, parkLng], {icon: parkMarker}).addTo(mymap)
                                                    .bindPopup(`<a href='http://${parkWiki}' target='_blank'>${parkName}</a>.<br><img src='${parkImage}' width='300px'/>`);                                            
                                        
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
                                var newMountainName = mountainName.replace(/ /g, "%20");

                        
                                var mountainMarker = L.AwesomeMarkers.icon({
                                    icon: 'mountain',
                                    markerColor: 'gray',
                                    prefix: 'fa',
                                    iconColor: 'white'
                                });

                                var mountainImage = "";
                                var mountainWiki = "";

                                $.ajax({
                                    url: "php/wiki.php",
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        capital: newMountainName,
                                    },
                            
                                    success: function(result) {
                            
                                        if (result.status.name == "ok") {                                           
                                        
                                            if (result.data[0] == undefined) {
                                                mountainWiki = "https://en.wikipedia.org/wiki/Mountain";
                                            } else {
                                                mountainWiki = result.data[0].wikipediaUrl;
                                            }                                  
                                        }
                                    
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        // your error code
                                    }
                                });

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

                                            if (result.data == undefined) {
                                                mountainImage = "./icons/mountain_icon.png";
                                            } else {
                                                mountainImage = result.data.imageinfo[0].responsiveUrls[2];
                                            }
                                          
                                            $([mountainImage]).preload();

                                                L.marker([mountainLat, mountainLng], {icon: mountainMarker}).addTo(mymap)
                                                .bindPopup(`<a href='http://${mountainWiki}' target='_blank'>${mountainName}</a>.<br><img src='${mountainImage}' width='300px'/>`);                                            
                                    
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

var newDemonym = "";

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
                
                newDemonym = result.data.border.demonym;
                var newCurrency = result.data.border.currencies[0].name;
                var newCurrencySymbol = result.data.border.currencies[0].symbol;
                var newFlag = result.data.border.flag;
                var newLanguage = result.data.border.languages[0].name;
                photoCountry = result.data.border.name;
                

                
                $('#demonym').html("Demonym: " + newDemonym);
                $('#currency').html("Currency: " + newCurrency + "(" + newCurrencySymbol + ")");
                $('#flag').html('<img src ="' + newFlag + '" ' + 'width="250px">');
                $('#language').html("Majority Language: " + newLanguage);
               

                $.ajax({
                    url: "php/anthem.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        country: newDemonym,
                    },
            
                    success: function(result) {
            
                        if (result.status.name == "ok") {    
                            
                            var anthem = result.data.data[0].id;
                            $('#anthem').html(`<iframe scrolling="no" frameborder="0" allowTransparency="true" src="https://www.deezer.com/plugins/player?format=classic&autoplay=false&playlist=true&width=500&height=90&color=EF5466&layout=&size=medium&type=tracks&id=${anthem}&app_id=1" width="500" height="90"></iframe>`);  
                              
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



