$(document).ready(function(){
    $('#register').on('click', function(){
        var name = $.trim($('#name').val());
        var address = $.trim($('#address').val());
        var city = $.trim($('#city').val());
        var country = $.trim($('#country').val());
        var sector = $.trim($('#sector').val());
        var website = $.trim($('#website').val());
        var img = $.trim($('#upload-input').val());
        var isValid = true;
        if(name == ''){
            isValid = false;
            $('#errorMsg1').html('Name field is empty');
        }else{
            $('#errorMsg1').html('');
        }

        if(address == ''){
            isValid = false;
            $('#errorMsg2').html('Address field is empty');
        }else{
            $('#errorMsg2').html('');
        }

        if(city == ''){
            isValid = false;
            $('#errorMsg3').html('City field is empty');
        }else{
            $('#errorMsg3').html('');
        }

        if(country == ''){
            isValid = false;
            $('#errorMsg4').html('Country field is empty>');
        }else{
            $('#errorMsg4').html('');
        }

        if(sector == ''){
            isValid = false;
            $('#errorMsg5').html('Sector field is empty');
        }else{
            $('#errorMsg5').html('');
        }

        if(website == ''){
            isValid = false;
            $('#errorMsg6').html('Website field is empty');
        }else{
            $('#errorMsg6').html('');
        }

        if(isValid == true){

            var companyData = {
                name: name,
                address: address,
                city: city,
                country: country,
                sector: sector,
                website: website,
                img: img
            };
            $.ajax({
                url: '/company/create',
                type: 'POST',
                data: companyData,
                success: function(data){
				 console.log("adad");
                    $('#name').val('');
                    $('#address').val('');
                    $('#city').val('');
                    $('#country').val('');
                    $('#sector').val('');
                    $('#website').val('');
                }
            });
        }else{
            return false;
        }

    });
})
