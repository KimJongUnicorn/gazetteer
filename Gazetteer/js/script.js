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

var featureGroup = L.featureGroup();
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

            if (result.status.name == "ok") {

                $('#loader').show();
                $('.lds-default').show();
                markers.clearLayers();
                featureGroup.clearLayers();
                var geoJsonLayer = null;

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

var markers = L.markerClusterGroup();


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
            
                        if (result.status.name == "ok") {

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
            
                        if (result.status.name == "ok") {

                            if (result.data == null) {
                                $('#news_text').html(`<p>No Articles Found.</p>`)
                            } else {

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
                            }

                            
                        
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
                
                //ADDING CAPITAL
                $.ajax({
                    url: "php/capital.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        country: newCountryCode
                    },
            
                            
                                    success: function(result) {
                            
                                        if (result.status.name == "ok") {

                                            console.log(result);

                                            var capitalJson = '';

                                            capitalJson = L.geoJson(result.data, {
                                                pointToLayer: function(feature, latlng) {
                                                    var capitalIcon = L.AwesomeMarkers.icon({
                                                        icon: 'star',
                                                        markerColor: 'orange',
                                                        prefix: 'fa',
                                                        iconColor: 'white'
                                                    });
                                                    return L.marker(latlng, {icon: capitalIcon});
                                                },
                                            onEachFeature: function (feature, layer) {

                                                    var photo = feature.properties.photo;                                                   
                                                    layer.bindPopup(`<a href='http://${feature.properties.wiki}' target='_blank'>${feature.properties.name}</a>, Population ${feature.properties.population}<br><img src='${photo}' width='300px'/>`);
                                            }
                                            });
                                            capitalJson.addTo(markers.addTo(mymap));

                                         
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
            
                        if (result.status.name == "ok") {
                            
                            console.log(result.data);

                            var cityJson = '';

                            cityJson = L.geoJson(result.data, {
                                pointToLayer: function(feature, latlng) {
                                    var cityIcon = L.AwesomeMarkers.icon({
                                        icon: 'city',
                                        markerColor: 'red',
                                        prefix: 'fa',
                                        iconColor: 'white'
                                    });
                                    return L.marker(latlng, {icon: cityIcon});
                                },
                               onEachFeature: function (feature, layer) {

                                    var photo = '';
                                    
                                    if (feature.properties.photo == null) {
                                        photo = "./icons/city_icon.png";
                                    } else {
                                        photo = feature.properties.photo;
                                    }
                                
                                    
                                    layer.bindPopup(`<a href='http://${feature.properties.wiki}' target='_blank'>${feature.properties.name}</a>, Population ${feature.properties.population}<br><img src='${photo}' width='300px'/>`);
                               }
                             });
                            cityJson.addTo(markers.addTo(mymap));
                    

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
            
                        if (result.status.name == "ok") {
                            
                            console.log(result.data);

                            var lakeJson = '';

                            lakeJson = L.geoJson(result.data, {
                                pointToLayer: function(feature, latlng) {
                                    var lakeIcon = L.AwesomeMarkers.icon({
                                        icon: 'water',
                                        markerColor: 'blue',
                                        prefix: 'fa',
                                        iconColor: 'white'
                                    });
                                    return L.marker(latlng, {icon: lakeIcon});
                                },
                               onEachFeature: function (feature, layer) {
                                var photo = '';
                                    
                                if (feature.properties.photo == null) {
                                    photo = "./icons/lake_icon.png";
                                } else {
                                    photo = feature.properties.photo;
                                }
                                    
                                    layer.bindPopup(`<a href='http://${feature.properties.wiki}' target='_blank'>${feature.properties.name}</a><br><img src='${photo}' width='300px'/>`);
                               }
                             });
                            lakeJson.addTo(markers.addTo(mymap));
                    

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
            
                        if (result.status.name == "ok") {
                            
                            console.log(result.data);

                            var parkJson = '';

                            parkJson = L.geoJson(result.data, {
                                pointToLayer: function(feature, latlng) {
                                    var parkIcon = L.AwesomeMarkers.icon({
                                        icon: 'tree',
                                        markerColor: 'green',
                                        prefix: 'fa',
                                        iconColor: 'white'
                                    });
                                    return L.marker(latlng, {icon: parkIcon});
                                },
                               onEachFeature: function (feature, layer) {
                                var photo = '';
                                    
                                if (feature.properties.photo == null) {
                                    photo = "./icons/park_icon.png";
                                } else {
                                    photo = feature.properties.photo;
                                }
                                    
                                    layer.bindPopup(`<a href='http://${feature.properties.wiki}' target='_blank'>${feature.properties.name}</a><br><img src='${photo}' width='300px'/>`);
                               }
                             });
                            parkJson.addTo(markers.addTo(mymap));
                            $('#loader').hide();
                            $('.lds-default').hide();
                    

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
            
                        if (result.status.name == "ok") {
                            
                            console.log(result.data);

                            var mountainJson = '';

                            mountainJson = L.geoJson(result.data, {
                                pointToLayer: function(feature, latlng) {
                                    var mountainIcon = L.AwesomeMarkers.icon({
                                        icon: 'mountain',
                                        markerColor: 'gray',
                                        prefix: 'fa',
                                        iconColor: 'white'
                                    });
                                    return L.marker(latlng, {icon: mountainIcon});
                                },
                               onEachFeature: function (feature, layer) {
                                var photo = '';
                                    
                                if (feature.properties.photo == null) {
                                    photo = "./icons/city_icon.png";
                                } else {
                                    photo = feature.properties.photo;
                                }
                                    
                                    layer.bindPopup(`<a href='http://${feature.properties.wiki}' target='_blank'>${feature.properties.name}</a><br><img src='${photo}' width='300px'/>`);
                               }
                             });
                            mountainJson.addTo(markers.addTo(mymap));
                            
                    

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
                            
                            if (result.data.data[0] == null) {
                                $('#anthem').html(`<p>No song found.</p>`);
                            } else {
                                var anthem = result.data.data[0].id;
                                $('#anthem').html(`<iframe scrolling="no" frameborder="0" allowTransparency="true" src="https://www.deezer.com/plugins/player?format=classic&autoplay=false&playlist=true&width=500&height=90&color=EF5466&layout=&size=medium&type=tracks&id=${anthem}&app_id=1" width="500" height="90"></iframe>`);
                            
                            }
                        
                              
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



