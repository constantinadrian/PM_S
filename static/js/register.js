$(document).ready(function () {

    // -------------- Use jQuery validate for register form -------------- //
    // https://jqueryvalidation.org/documentation/
    $('#register').validate({
        rules: {
            username: {
                required: true
            },
            usernameConfirmation: {
                required: true,
                equalTo: "#username"
            },
            password: {
                required: true
            },
            passwordConfirmation: {
                required: true,
                equalTo: "#password"
            },
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
            username: {required: "Please fill out this field"},
            usernameConfirmation: {required: "Please fill out this field", equalTo: "Please enter the same username again" },
            password: {required: "Please fill out this field" },
            passwordConfirmation: {required: "Please fill out this field", equalTo: "Please enter the same password again" },
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
    // -------------- End of jQuery validate for register form -------------- //

    // -------------- Click event for register details call jQuery validate-------------- //
    $('#btn-register').click(function(e) {
        // get all input field for validate
        var registerFields = $('#register').find(":input");

        // if fields are invalid prevent submit form
        if (!registerFields.valid()){
            e.preventDefault();
        }
    });
});
