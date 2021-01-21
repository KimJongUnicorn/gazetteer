$(document).ready(function() {

    $.ajax({
        url: "../php/countryBorders.php",
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