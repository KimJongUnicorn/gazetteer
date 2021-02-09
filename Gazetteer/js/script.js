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

//FUNCTION - FORMAT POPULATION TO BE MORE READABLE - TO BE USED LATER
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

$('#countryInfoButton').click(function() {
    $('#info_text').toggle();
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
                
                if (mymap.hasLayer(geoJsonLayer)) {
                    featureGroup.removeLayers(geoJsonLayer);
                }

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
                
                var newCapital = result.data.border.capital;
                var newContinent = result.data.border.continentName;
                var newPopulation = result.data.border.population;

                console.log(newCapital);

                $('#capitalCity').html("Capital City: " + newCapital);
                $('#continent').html("Continent: " + newContinent);
                $('#population').html("Population: " + formatNumber(newPopulation));               
               
                $.ajax({
                    url: "php/openWeather.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        city: newCapital
                    },
            
                    success: function(result) {
            
                        console.log(result);
            
                        if (result.status.name == "ok") {
                            
                            console.log("hello");
                         
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

                
                $('#demonym').html("Demonym: " + newDemonym);
                $('#currency').html("Currency: " + newCurrency + "(" + newCurrencySymbol + ")");
                $('#flag').html('<img src ="' + newFlag + '" ' + 'width="250px">');
                $('#language').html("Majority Language: " + newLanguage);
             
                $.ajax({
                    url: "php/openWeather.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        lat: mymap.getBounds().getCenter().lat,
                        lon: mymap.getBounds().getCenter().lng
                    },
            
                    success: function(result) {
            
                        console.log(result);
            
                        if (result.status.name == "ok") {
                            
                            console.log("hello");
                         
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

