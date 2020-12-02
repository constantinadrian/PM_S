$(document).ready(function () {

    // -------------- Remove all error from jQuery validate -------------- //
    // function that remove the error from the company details form if user 
    // decides to cancel the edit modal and leave error fields behind
    // so for the next UX all fields are clear of error
    // credit https://stackoverflow.com/questions/11360925/how-to-clear-jquery-validate-errors#14831537 
    function clearjQueryValidationErrors(formId) {
        // get section id
        var form = $('#' + formId);
        
        // get the section for validate
        var validator = form.validate();

        // reset the section with resetForm() function from jQuery validate
        validator.resetForm();

        // remove the error class that I added to highlight input border when error
        form.find('.has-error').removeClass("has-error");
    }
    // -------------- End of function that removes all error from jQuery validate -------------- //


    // -------------- Use jQuery validate for update profile form -------------- //
    // https://jqueryvalidation.org/documentation/
    $('#profile').validate({
        rules: {

            userCompanyName: {
                required: true,
                minlength: 3,
                maxlength: 255
            },
            userAddress1: {
                required: true,
                minlength: 3,
                maxlength: 120
            },
            userAddress2: {
                required: true,
                minlength: 3,
                maxlength: 120
            },
            userAddress3: {
                required: true,
                minlength: 3,
                maxlength: 120
            },
            userCompanyRegistrationNumber: {
                required: true,
                minlength: 3,
                maxlength: 10
            },
            userCompanyVatRate: {
                required: true,
                number: true,
                pattern: /^([1-9]{1}[0-9]{0,1})([.][0-9]{1,3})?$/,
            },
            userPhoneNumber: {
                required: true,
                digits: true,
                minlength: 3,
                maxlength: 20
            },
            userLandlineNumber: {
                required: true,
                digits: true,
                minlength: 3,
                maxlength: 20
            },
            userEmail: {
                required: true,
                email: true
            },
            userContactName: {
                required: true,
                minlength: 3,
                maxlength: 255
            },
            userCity: {
                required: true,
                minlength: 3,
                maxlength: 120
            },
            userCountry: {
                required: true,
            },
            userZipCode: {
                required: true,
                minlength: 3,
                maxlength: 20
            }

        },

        messages: {
            userCompanyName: {required: "Please fill out this field" },
            userAddress1: {required: "Please fill out this field" },
            userAddress2: {required: "Please fill out this field" },
            userAddress3: {required: "Please fill out this field" },
            userCompanyRegistrationNumber: {required: "Please fill out this field" },
            userCompanyVatRate: {required: "Please fill out this field" },
            userPhoneNumber: {required: "Please fill out this field" },
            userLandlineNumber: {required: "Please fill out this field" },
            userEmail: {required: "Please fill out this field", email: "Please enter a valid email address" },
            userContactName: {required: "Please fill out this field" },
            userCity: {required: "Please fill out this field" },
            userCountry: {required: "Please fill out this field" },
            userZipCode: {required: "Please fill out this field" }

        },
        highlight: function(element) {
            $(element).addClass('has-error');
        },
        unhighlight: function(element) {
            $(element).removeClass('has-error');
        },
        errorPlacement: function(error, element) {
            if (element.parent('.input-group').length)
            {
                error.insertAfter(element.parent());
            }
            else
            {
                error.insertAfter(element);
            }  
        }      
    });


    // -------------- Validate the profile form before submit -------------- //
    $('#btnUpdateDetails').click(function(e) {
        // get all input fields from the form
        var profileFields = $('#profile').find(":input");

        // if fields are invalid prevent submit form
        if (!profileFields.valid()){
            e.preventDefault();
        }
    });
    // -------------- End of validate the profile form before submit -------------- //


    // -------------- Function that show the form with the input field ready for edit -------------- //
    function showForm(){
        // get all input field from the company details form
        var inputElems = $('#profile').find(":input");

        // remove 'form-control-plaintext' class so the form can be edited
        for (var i = 0, l = inputElems.length; i < l; i++)
        {

            $(inputElems[i]).removeClass('form-control-plaintext');

            $(inputElems[i]).addClass('form-control');

            $(inputElems[i]).prop( "readonly", false );

        }

        // remove the plaintext class from select field
        $('select').removeClass('form-control-plaintext-select'); 
        $('select').addClass('form-control'); 

        // make the select field editable
        $('select').prop( "disabled", false );

        // show the arrow on select field
        $('select').removeClass('custom-select-plaintext');
        $('select').addClass('custom-select');

        // show the update details btn (by defauls the btn is hide)
        $('#btnUpdateDetails').toggle();
    }
    // -------------- End of function that show the form with the input field ready for edit -------------- //


    // --------------Function that show the form as PLAIN TEXT -------------- //
    function plaintext(){
        // get all input field from the company details form
        var inputElems = $('#profile').find(":input");

        // remove 'form-control' class so user can see just plaintext
        for (var i = 0, l = inputElems.length; i < l; i++)
        {

            $(inputElems[i]).removeClass('form-control');

            $(inputElems[i]).addClass('form-control-plaintext');  

            $(inputElems[i]).prop( "readonly", true );
        }

        // remove the form control from select field
        $('select').removeClass('form-control'); 
        $('select').addClass('form-control-plaintext-select'); 

        // disable the select field
        $('select').prop( "disabled", true );

        // hide the arrow from select field
        $('select').removeClass('custom-select');
        $('select').addClass('custom-select-plaintext'); 

        // hide the update button
        $('#btnUpdateDetails').toggle();

        // reset the form to default values if user doesn't update form
        $('#profile')[0].reset();

        // reset all error from the form if any
        clearjQueryValidationErrors('profile');
    }
    // -------------- End of function that show the form as PLAIN TEXT -------------- //


    // -------------- Event click that toggle user details -------------- //
    $('#viewAllDetails').click(function(){
        // show the company details 
        $('#companyDetails').toggle();

        // toggle the form back to default plain text if the user press the view details to toggle/hide the company details when the form is on edit mode
        if($('#userCompanyName').hasClass('form-control'))
        {
            plaintext();
        }
    });
    // -------------- End of event click that toggle user details -------------- //


    // -------------- Toggle the edit form when click -------------- //
    $('#editCompanyDetails').click(function(){
        // toggle the edit form depending on which class is currently acctive
        if($('#userCompanyName').hasClass('form-control-plaintext'))
        {
            showForm();
        }
        else
        {
            plaintext();
        }
    });
    // -------------- End of toggle the edit form when click -------------- //

});