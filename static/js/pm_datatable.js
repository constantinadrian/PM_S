$(document).ready(function () {

    // -------------- DataTable functionality -------------- //
    // https://datatables.net/manual/
    $('#pm-table').DataTable({

        // put full paging on bottoms of table
        "pagingType": "full_numbers",

        // order data in first column in asc order
        "order": [[0, "desc"]],

        // hide the show entry
        // dom: 'Bfrtip',

        // change the show entry list
        lengthMenu: [[ 10, 25, 50, 100, -1 ],[ 10, 25, 50, 100, 'All']],

        // chnage buttons apperance
        buttons: [
            {
                extend: 'copy',
                text: '<i class="far fa-copy fa-md"></i>',
                titleAttr: 'Copy'
            },
            {
                extend: 'csv',
                text: '<i class="fas fa-file-csv fa-md">',
                titleAttr: 'CSV'
            },
            {
                extend: 'excel',
                text: '<i class="far fa-file-excel fa-md"></i>',
                titleAttr: 'Excel'
            },
            {
                extend: 'pdf',
                text: '<i class="far fa-file-pdf fa-md"></i>',
                titleAttr: 'PDF'
            },
            {
                extend: 'print',
                text: '<i class="fas fa-print fa-md"></i>',
                titleAttr: 'Print'
            },
            {
                extend: 'colvis',
                text: '<i class="far fa-eye-slash fa-md"></i> Hide Columns',
                titleAttr: 'Column Visibility',
                className: 'colVisBtn'
            }
    ],
    // make table responsive for small devices
    responsive: true,

    // brings each column back to it's size after the hide columns it's set to show
    "bAutoWidth": false,

    // insert buttons into the target container #buttons
    initComplete:function(){
        var table = $('#pm-table').DataTable();
        table.buttons().container().prependTo("#buttons");
    }

    });
    // -------------- End of DataTable functionality -------------- //

 
    // -------------- Initialize all tooltips on a page -------------- //
    // https://getbootstrap.com/docs/4.5/components/tooltips/
    $('[data-toggle="tooltip"]').tooltip({
        trigger : 'hover'
    });
    // -------------- End of initialize all tooltips on a page -------------- //


    // -------------- Remove all error from jQuery validate -------------- //
    // function that remove the error from each section if user 
    // decides to cancel the edit modal and leave error fields behind
    // so for the next UX when modal is open all fields are clear of error
    // credit https://stackoverflow.com/questions/11360925/how-to-clear-jquery-validate-errors#14831537 
    function clearjQueryValidationErrors(sectionId) {
        // get section id
        var section = $('#' + sectionId);

        // get the section for validate
        var validator = section.validate();

        // reset the section with resetForm() function from jQuery validate
        validator.resetForm();

        // remove the error class that I added to highlight input border when error
        section.find('.has-error').removeClass("has-error");
    }
    // -------------- End of function that removes all error from jQuery validate -------------- //


    // -------------- Use jQuery validate for pm modal edit details form -------------- //
    // https://jqueryvalidation.org/documentation/
    $('#updateDetails').validate({
        rules: {
            companyName: {
                required: true,
                minlength: 3,
                maxlength: 255
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
            companyName: 
            {
                required: "Please fill out this field", 
                minlength: "Please enter at least 3 characters.",
                maxlength: "Please enter no more than 4 characters."
            },
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
        },      
    });
    // -------------- End of jQuery validate for pm modal edit details form -------------- //



    // -------------- Toggle Update PM Details- Delete UX Body -------------- //
    // declare a variable to hold the body of pm update details
    var pmUpdateDetailsBody;
    var PM_Details_Delete_UX = false;

    // Toogle Update - Delete UX Body
    function showUpdateModalDetails() {

        // Show Delete Message Body/Div if user press Delete Btn and detach Details Body Form
        // to check is variable is undefined and null: https://stackoverflow.com/questions/5113374/javascript-check-if-variable-exists-is-defined-initialized/36432729#36432729
        if ((typeof pmUpdateDetailsBody === "undefined") || (pmUpdateDetailsBody === null))
        {
            // check which section is visible in order to remove any error 
            // validation in case the user accidently delete some field
            if ($('#modalCompanyDetails').is(':visible'))
            {
                clearjQueryValidationErrors('modalCompanyDetails');
            }
            else
            {
                clearjQueryValidationErrors('modalJobDetails');
            }

            pmUpdateDetailsBody = $('#pmNewDetails').detach();
            $('#second-modal-footer').hide();
            $('#btnDelete').hide();
            $('#btnSave').hide();
            $('#deletePmDetails').show();
        }
        // Otherwise Show Update Details Body Form and hide Delete Message Body/Div
        else
        {
            $('#deletePmDetails').hide();

            // append to the same wrapper inside the form where the pmUpdateDetailsBody was initialy 
            // so the 'jQuery validate' can validate in case user updates the PM details
            pmUpdateDetailsBody.appendTo('.wrapper-pmNewDetails');
            $('#btnDelete').show();

            // depends from which section user toggle the UX Detele when user cancel 
            // and come back to Update Details show the section that was currently on
            if ($('#modalCompanyDetails').is(':visible'))
            {
                $('#btn-modalPrevious').hide();
                $("#btnSave").hide();
                $('#second-modal-footer').show();
                $('#btn-modalNext').show();
            }
            else
            {
                $('#btn-modalNext').hide();
                $('#second-modal-footer').show();
                $('#btn-modalPrevious').show();
                $("#btnSave").show();
            }
            // set the pmUpdateDetailsBody to null for next UX
            pmUpdateDetailsBody = null;
        }
    }
    // -------------- End of Toggle Update PM Details- Delete UX Body -------------- //


    // -------------- Add on click event for btn Delete and Cancel for toggle UX -------------- //
    // If user press delete btn toogle the UX 
    $("#btnDelete, #btnDeleteCancel").on("click", function() {
        showUpdateModalDetails();
        
        // set the variable for next UX when modal hidden if user action is to delete PM, 
        // or maybe he cancel 'Update PM details' and close the modal in delete UX
        if(PM_Details_Delete_UX == false)
        {
            PM_Details_Delete_UX = true;
        }
        else
        {
            PM_Details_Delete_UX = false;
        }
    });
    // --------------End of on click event for btn Delete and Cancel for toggle UX -------------- //

    
    // -------------- Toogle each section of modal after validation is done -------------- // 
    $('.btn-modal-body').click(function() {
        var btn_id = $(this).attr('id');

        // declare variable in order to reset the scrollbar position when toggle between sections
        var updateModalDetails = $('#updateModalDetails');

        // going to next section
        if (btn_id === 'btn-modalNext'){

            var companyDetailsFields = $('#modalCompanyDetails').find(":input");

            if(companyDetailsFields.valid())
            {
                // Hide current section
                $('#modalCompanyDetails').hide();

                // Hide modal next btn 
                $('#btn-modalNext').hide();
                
                // reset the scrollbar position to the top for next section
                updateModalDetails.find('.modal-body').scrollTop(0); 

                // Show the next section
                $('#modalJobDetails').show();

                // Show modal previous btn
                $('#btn-modalPrevious').show();

                // Show save button on next section
                $("#btnSave").show();

            }
        }
        // going to previous section - here we don't do any validation because the user 
        // will have to come back to second field in order to complete the update
        else if (btn_id === 'btn-modalPrevious')
        {
            // Hide current section
            $('#modalJobDetails').hide();

            // Hide modal previous btn
            $('#btn-modalPrevious').hide();

            // Hide save button from first section
            $("#btnSave").hide();

            // reset the scrollbar position to the top for next section
            updateModalDetails.find('.modal-body').scrollTop(0);

            // Show the previous section
            $('#modalCompanyDetails').show();

            // Show modal next btn 
            $('#btn-modalNext').show();

            // Hide error fields if going back to previous section
            // (we do this in case the user cancel the modal so we could avoid having error in Job Details section on future UX edit modal)
            clearjQueryValidationErrors('modalJobDetails');
        }     
    });
    // -------------- End of Toogle each section of modal after validation is done -------------- //


    // -------------- Validate the last section before submit -------------- //
    $('#btnSave').click(function(e) {
        var jobDetailsFields = $('#modalJobDetails').find(":input");

        // if fields are invalid prevent submit form
        if (!jobDetailsFields.valid()){
            e.preventDefault();
        }
    });
    // -------------- End of validate the last section before submit -------------- //

 
    // -------------- For update modal content -------------- //
    // https://getbootstrap.com/docs/4.5/components/modal/
    $('#updateModalDetails').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var companyName = button.data('company'); // Extract info from data-* attributes
        var address1 = button.data('address1'); // Extract info from data-* attributes
        var address2 = button.data('address2'); // Extract info from data-* attributes
        var address3 = button.data('address3'); // Extract info from data-* attributes
        var phoneNumber = button.data('phonenumber'); // Extract info from data-* attributes
        var landlineNumber = button.data('landlinenumber'); // Extract info from data-* attributes
        var email = button.data('email'); // Extract info from data-* attributes
        var contactName = button.data('contactname'); // Extract info from data-* attributes
        var city = button.data('city'); // Extract info from data-* attributes
        var zipCode = button.data('zipcode'); // Extract info from data-* attributes

        var technician = button.data('technician'); // Extract info from data-* attributes
        var jobType = button.data('jobtype'); // Extract info from data-* attributes
        var jobDescription = button.data('jobdescription'); // Extract info from data-* attributes
        var jobQuantity = button.data('quantity'); // Extract info from data-* attributes
        var jobPrice = button.data('jobprice'); // Extract info from data-* attributes
        var start_event = button.data('start_event'); // Extract info from data-* attributes
        var end_event = button.data('end_event'); // Extract info from data-* attributes
        var labourDescription = button.data('labourdescription'); // Extract info from data-* attributes
        var labourHours = button.data('labourhours'); // Extract info from data-* attributes
        var labourRate = button.data('labourrate'); // Extract info from data-* attributes
        var labourTotalPrice = button.data('labourtotalprice'); // Extract info from data-* attributes
        var priority = button.data('priority'); // Extract info from data-* attributes
        var status = button.data('status'); // Extract info from data-* attributes

        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this);

        // For Old PM details
            // For Old Company Details
        modal.find('.modal-title').text('Update PM Details');
        modal.find('#oldData-companyName').val(companyName);
        modal.find('#oldData-address1').val(address1);
        modal.find('#oldData-address2').val(address2);
        modal.find('#oldData-address3').val(address3);
        modal.find('#oldData-phoneNumber').val(phoneNumber);
        modal.find('#oldData-landlineNumber').val(landlineNumber);
        modal.find('#oldData-email').val(email);
        modal.find('#oldData-contactName').val(contactName);
        modal.find('#oldData-city').val(city);
        modal.find('#oldData-zipCode').val(zipCode);
            // For Old Job Details
        modal.find('#oldData-technician').val(technician);
        modal.find('#oldData-jobType').val(jobType);
        modal.find('#oldData-jobDescription').val(jobDescription);
        modal.find('#oldData-jobQuantity').val(jobQuantity);
        modal.find('#oldData-jobPrice').val(jobPrice);
        modal.find('#oldData-start_event').val(start_event);
        modal.find('#oldData-end_event').val(end_event);
        modal.find('#oldData-labourDescription').val(labourDescription);
        modal.find('#oldData-labourHours').val(labourHours);
        modal.find('#oldData-labourRate').val(labourRate);
        modal.find('#oldData-labourTotalPrice').val(labourTotalPrice);
        modal.find('#oldData-jobPriority').val(priority);
        modal.find('#oldData-status').val(status);

        // For updated PM details
            // For Company Details
        modal.find('#companyName').val(companyName);
        modal.find('#address1').val(address1);
        modal.find('#address2').val(address2);
        modal.find('#address3').val(address3);
        modal.find('#phoneNumber').val(phoneNumber);
        modal.find('#landlineNumber').val(landlineNumber);
        modal.find('#email').val(email);
        modal.find('#contactName').val(contactName);
        modal.find('#city').val(city);
        modal.find('#zipCode').val(zipCode);
            // For Job Details 
        modal.find('#technician').val(technician);
        modal.find('#jobType').val(jobType);
        modal.find('#jobDescription').val(jobDescription);
        modal.find('#jobPrice').val(jobPrice);
        modal.find('#start_event').val(start_event);
        modal.find('#end_event').val(end_event);
        modal.find('#labourHours').val(labourHours);
        modal.find('#labourRate').val(labourRate);
        modal.find('#jobPriority').val(priority);
        modal.find('#status').val(status);
    });
    // -------------- End of update modal content -------------- //

    
    // -------------- Clear the fields from the modal when the modal is hidden -------------- //
    $('#updateModalDetails').on('hidden.bs.modal', function () {
        var modal = $(this);
            // For Company Details
        modal.find('#companyName').val('');
        modal.find('#address1').val('');
        modal.find('#address2').val('');
        modal.find('#address3').val('');
        modal.find('#phoneNumber').val('');
        modal.find('#landlineNumber').val('');
        modal.find('#email').val('');
        modal.find('#contactName').val('');
        modal.find('#city').val('');
        modal.find('#zipCode').val('');
            // For Job Details 
        modal.find('#technician').val('');
        modal.find('#jobType').val('');
        modal.find('#jobDescription').val('');
        modal.find('#jobPrice').val('');
        modal.find('#start_event').val('');
        modal.find('#end_event').val('');
        modal.find('#labourHours').val('');
        modal.find('#labourRate').val('');
        modal.find('#jobPriority').val('');
        modal.find('#status').val('');

        // If User press the Detele Pm Btn, toggle back to default of Update Details Body Form for next UX
        if(PM_Details_Delete_UX == true)
        {
            showUpdateModalDetails();
            $('#modalJobDetails').hide();
            $('#btn-modalPrevious').hide();
            $("#btnSave").hide();
            $('#modalCompanyDetails').show();
            $('#second-modal-footer').show();
            $('#btn-modalNext').show();
            PM_Details_Delete_UX = false;
        }
        else
        {
            // reset any error field that user left behind when he close/cancel the edit modal
            clearjQueryValidationErrors('modalJobDetails');
            clearjQueryValidationErrors('modalCompanyDetails');

            // make sure that we leave visible the Company Details section for new user experience
            $('#modalJobDetails').hide();
            $('#btn-modalPrevious').hide();
            $("#btnSave").hide();
            $('#modalCompanyDetails').show();
            $('#second-modal-footer').show();
            $('#btn-modalNext').show();
            
        }

    });
    // -------------- End of clear the fields from the modal when the modal is hidden -------------- //

});

