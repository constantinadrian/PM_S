$(document).ready(function () {

    // -------------- Use jQuery validate for pm modal edit details form -------------- //
    // https://jqueryvalidation.org/documentation/
    $('#form-createpm').validate({
        rules: {
            companyName: {
                required: true
            },
            address1: {
                required: true
            },
            address2: {
                required: true
            },
            address3: {
                required: true
            },
            phoneNumber: {
                required: true
            },
            landlineNumber: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            contactName: {
                required: true
            },
            city: {
                required: true
            },
            zipCode: {
                required: true
            },

            technician: {
                required: true
            },
            jobType: {
                required: true
            },
            jobDescription: {
                required: true
            },
            jobPrice: {
                required: true,
                number: true
            },
            start_event: {
                required: true
            },
            end_event: {
                required: true
            },
            labourRate: {
                required: true,
                number: true
            },
            jobPriority: {
                required: true
            },
            status: {
                required: true
            }

        },
        messages: {
            companyName: {required: "Please fill out this field" },
            address1: {required: "Please fill out this field" },
            address2: {required: "Please fill out this field" },
            address3: {required: "Please fill out this field" },
            phoneNumber: {required: "Please fill out this field" },
            landlineNumber: {required: "Please fill out this field" },
            email: {required: "Please fill out this field", email: "Please enter a valid email address" },
            contactName: {required: "Please fill out this field" },
            city: {required: "Please fill out this field" },
            zipCode: {required: "Please fill out this field" },

            technician: {required: "Please fill out this field" },
            jobType: {required: "Please fill out this field" },
            jobDescription: {required: "Please fill out this field" },
            jobPrice: {required: "Please fill out this field", number: "Please enter a valid number"},
            start_event: {required: "Please fill out this field" },
            end_event: {required: "Please fill out this field" },
            labourRate: {required: "Please fill out this field", number: "Please enter a valid number"},
            jobPriority: {required: "Please fill out this field" },
            status: {required: "Please fill out this field" }
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

    // toogle show/hide content by going to next section
    $('#showHideCompanyDetails, #btn-Next').click(function() {

        var divFields = $(this).closest("div").find(":input");

        // validate this section
        if (divFields.valid()){

            // Hide current section
            $('#companyDetails').slideToggle('slow');

            // reset the scrollbar position to the top for next section
            $("html, body").animate({ scrollTop: 0 }, "slow");

            // Show the next section
            $('#jobDetails').slideToggle('slow');
        
        }
    });

    // toogle show/hide content by going to previous section
    $('#showHideJobDetails, #btn-Previous').click(function(){

        // Hide current section
        $('#jobDetails').slideToggle('slow');

        // reset the scrollbar position to the top for next section
        $("html, body").animate({ scrollTop: 0 }, "slow");

        // Go back to previous section
        $('#companyDetails').slideToggle('slow');

    });
});