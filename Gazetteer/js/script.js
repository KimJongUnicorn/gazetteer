var mymap = L.map('mapid').setView([53.100, -1.785], 5.75); 

const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
const tileUrl = "https://api.mapbox.com/styles/v1/kimjongunicorn/ckjyf3voz0pmt17nu6fys3ht7/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2ltam9uZ3VuaWNvcm4iLCJhIjoiY2tqeWV6MXV2MGI3YzJvbzJkenl0ZXl2bSJ9.r56ig_YevLwVREuhe6HhlA";
var tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

L.Control.textbox = L.Control.extend({
    onAdd: function(mymap) {
        
    var text = L.DomUtil.create('div');
    text.id = "info_text";
    text.innerHTML = "<h4>Country Information<h4><br><p id='capitalCity'>Capital City: </p>";
    return text;
    },

    onRemove: function(mymap) {
        // Nothing to do here
    }
});
L.control.textbox = function(opts) { return new L.Control.textbox(opts);}
L.control.textbox({ position: 'topright' }).addTo(mymap);

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
                
                var mygeoJson = result.data.border;
                var newView1 = result.data.border.geometry.coordinates[0][0][0];
                var newView2 = result.data.border.geometry.coordinates[0][0][1];

                var myStyle = {
                    "color": "#000000",
                    "weight": 3,
                    "opacity": 0.4
                };

                L.geoJson(mygeoJson, {
                    style: myStyle
                }).addTo(mymap);

                console.log(newView1, newView2);
 
                if (Array.isArray(newView1)) {
                    mymap.setView([newView2[1], newView2[0]], 5.75);
                } else {
                    mymap.setView([newView2, newView1], 5.75);
                }               
                
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 


});

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
                console.log(newCapital);

                $('#capitalCity').append(newCapital);

               
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 


});