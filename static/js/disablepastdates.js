// For Datetimepicker and auto field that shows the working hours between the two dates
// https://plugins.jquery.com/datetimepicker/ -> official website: https://xdsoft.net/jqplugins/datetimepicker/

$(document).ready(function () { 

    // create empty array for disable public holidays dates and defaulthighlights the public holiday (and set up each name) for datetimepicker
    var publicholidays = [];
    var defaulthighlights = [];

    if (publicHolidayJson)
    {
        // manipulate publicHoliday json for our needs by convert it to a string with the JSON.stringnify 
        var stringPublicHolidayJson = JSON.stringify(publicHolidayJson);

        // Use the slice() method extract parts of a string and return the extracted part in a new string 
        // as we need only the holiday obj 
        var stringPublicHolidayJson2 = stringPublicHolidayJson.slice(45);

        // use the replace() method to searche in the string for the specified value and return a new string where the specified value is replaced
        var stringPublicHolidayJson3 = stringPublicHolidayJson2.replace(']}}','');

        // add bracket to the string to make it an array of obj
        var stringPublicHolidayJson4 = "[" + stringPublicHolidayJson3 + "]";

        // use JSON.parse to convert string into a JavaScript object
        var newPublicHolidayObject = JSON.parse(stringPublicHolidayJson4);

        // iterate over array of obj to get the dates and names of each public holiday
        for(var i = 0, l = newPublicHolidayObject.length; i < l; i++)
        {
            var nameHol = newPublicHolidayObject[i].name;
            var dateHol = newPublicHolidayObject[i].date.iso;

            publicholidays.push(dateHol);
            defaulthighlights.push(`${dateHol},${nameHol},xdsoft_highlighted_mint`);
        }
    }


    // -------------- Calculate the working hours between two dates -------------- //
    function calcLaborHours(startDate, endDate)
    {
        var laborHours = 0;

        // get the timeDifference in miliseconds
        var timeDifference = endDate.getTime() - startDate.getTime();

        // declare variable
        var milliSecondsInOneSecond = 1000;
        var secondInOneHour = 3600;
        var secondInOneMinute = 60;

        // check how many hours are between the two dates
        var hoursDiff = Math.floor(timeDifference / (milliSecondsInOneSecond * secondInOneHour));

        // take out the hours out from the timeDifference
        timeDifference -= (hoursDiff * milliSecondsInOneSecond * secondInOneHour);
        if (hoursDiff > 0)
        {
            laborHours += hoursDiff;
        }

        // check how many min are in the timeDifference after we remove the hoursDiff
        var minDiff = Math.floor(timeDifference / (milliSecondsInOneSecond * secondInOneMinute));

        if (minDiff > 0)
        {
            laborHours += 0.5;
        }
        
        return laborHours;
    }
    // -------------- End of calculate the working hours between two dates -------------- //


    // -------------- Function that calculate how many days are between two dates exculed weekend and public holidays -------------- //
    // function from: https://snipplr.com/view/4086/calculate-business-days-between-two-dates  
    // and ajusted to remove the days that are public holiday between the two dates
    function calcBusinessDays(dDate1, dDate2) 
    {
        var iWeeks,
            iDateDiff;
        if (dDate2 < dDate1) return -1; // error code if dates transposed

        var iWeekday1 = dDate1.getDay(); 
        var iWeekday2 = dDate2.getDay();

        // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
        iWeeks = Math.floor((dDate2.getTime() - dDate1.getTime()) / 604800000);

        if (iWeekday1 <= iWeekday2) 
        {
            iDateDiff = iWeeks * 5 + (iWeekday2 - iWeekday1);
        }
         else 
        {
            iDateDiff = (iWeeks + 1) * 5 - (iWeekday1 - iWeekday2);
        }

        // declare variable to count how many public holidays are between the two dates
        var holidays = 0;
        // iterate thru public Holiday array and if the public holiday is NOT in weekend and are between the two dates increase holidays counter
        for (var i = 0; i < publicholidays.length; i++) {
            // avoid counting the Public Holidays if they are in weekend 
            if (new Date(publicholidays[i]).getDay() != 0 && (new Date(publicholidays[i]).getDay()) != 6) {
                // count public holiday only if holiday are between the two dates
                if (new Date(publicholidays[i]).getTime() >= dDate1.getTime() && new Date(publicholidays[i]).getTime() <= dDate2.getTime()) {
                    holidays += 1;
                }
            }
        }
       
        return iDateDiff + 1 - holidays; // add 1 because dates are inclusive  - holidays (if any)
    }
    // -------------- End function that calculate how many days are between two dates exculed weekend and public holidays -------------- //


    // -------------- Function that display in auto field 'Labour hours' how many working hours are between the two selected dates-------------- //
    function calcDifferenceBetweenTwoDates()
    {
        if ( ($("#start_event").val() !== '') && ($("#end_event").val() !== '') )
        {

            var hours;
            var start_date = new Date($('#start_event').val());
            var end_date = new Date($('#end_event').val());

            var temp_start_date, 
                temp_end_date, 
                temp_start_hours,
                temp_end_hours; 
            
            // call function to calculate how many working business days are between start and end event
            var days = (calcBusinessDays(start_date, end_date));

            // if result is negative that means that user selected the end day in the past compare to start day 
            // and we will chnage the field between them
            if (days < 0)
            {
                // make the user aware of the change
                document.querySelector('.end-event-span').textContent = "Oops! End Date/Time is in the Past Compared to the Start Date/Time! So the fields were swapped";
                
                // declare temporary variable to swap the values
                var temp = $('#start_event').val();
                $('#start_event').val($('#end_event').val());
                $('#end_event').val(temp);

                // call again the function
                calcDifferenceBetweenTwoDates();

                // lose focus on fields
                $('#start_event').blur();
                $('#end_event').blur();

                // use setTimeout function to remove the message after 5 seconds
                setTimeout(function(){
                    document.querySelector('.end-event-span').textContent = "";
                },5000);
            }
            // if the datetimes for Start and End are the same reset the End datetime field
            // and make the user aware of that
            else if (start_date.getTime() == end_date.getTime())
            {
                document.querySelector('.end-event-span').textContent = "Oops! End Date/Time is the same as Start Date/Time!";

                $('#end_event').datetimepicker('reset');
                $("#labourHours").val('');
               
                setTimeout(function(){
                    document.querySelector('.end-event-span').textContent = "";
                    $('#start_event').blur();
                    $('#end_event').valid();
                    $('#end_event').blur();
                },3000);
            }
            // if from Start to End date is only 1 working day call function to calculate working hours
            else if (days === 1)
            {
                hours = calcLaborHours(start_date, end_date);

                $("#labourHours").val(hours).css('border-color', '#DCDCDC');
            }
            else if (days === 2)
            {   
                // create variable to make new Date object for temp_Start and temp_End date
                var y_start = end_date.getFullYear(), m_start = end_date.getMonth(), d_start = end_date.getDate(), h_start = 9, min_start = 0;
                var y_end = start_date.getFullYear(), m_end = start_date.getMonth(), d_end = start_date.getDate(), h_end = 17, min_end = 0;

                temp_start_date = new Date(y_start, m_start, d_start, h_start, min_start);
                temp_end_date = new Date(y_end, m_end, d_end, h_end, min_end);

                // calculate labor hours for the first day
                temp_start_hours = calcLaborHours(start_date, temp_end_date);

                // calculate labor hours for the last day 
                temp_end_hours = calcLaborHours(temp_start_date, end_date);

                // calculate the total labour hours for the working days
                hours = temp_start_hours + temp_end_hours;

                $("#labourHours").val(hours).css('border-color', '#DCDCDC');

            }
            else if (days > 2)
            {
                // create variable to make new Date object for temp_Start and temp_End date
                var y_start = end_date.getFullYear(), m_start = end_date.getMonth(), d_start = end_date.getDate(), h_start = 9, min_start = 0;
                var y_end = start_date.getFullYear(), m_end = start_date.getMonth(), d_end = start_date.getDate(), h_end = 17, min_end = 0;
                temp_start_date = new Date(y_start, m_start, d_start, h_start, min_start);
                temp_end_date = new Date(y_end, m_end, d_end, h_end, min_end);

                // calculate labor hours for the first day
                temp_start_hours = calcLaborHours(start_date, temp_end_date);

                // calculate labor hours for the last day 
                temp_end_hours = calcLaborHours(temp_start_date, end_date);

                // calculate the total labour hours for the working days
                // by adding the hours from first working day + working hours from last working day + working hours from the full days between them
                hours = temp_start_hours + temp_end_hours + ((days - 2) * 8 );

                $("#labourHours").val(hours).css('border-color', '#DCDCDC');
            }          
        }
    }
    // -------------- End of function that display in auto field 'Labour hours' how many working hours are between the two selected dates -------------- //
    

    // -------------- Validate the Business hours for start and end date/time -------------- //
    function validateStartDateBusinessHours() 
    {  
        var validateStartTime = new Date($('#start_event').val());
        if ((validateStartTime.getDay() == 0) || (validateStartTime.getDay() == 6)) {
            $('#start_event').datetimepicker('reset');
            alert("Sorry! Weekend date time not allow.");
        }
        else if ((validateStartTime.getHours() < 9) || (validateStartTime.getHours() > 16))
        {
            $('#start_event').datetimepicker('reset');
        }
        else if ((validateStartTime.getHours() == 16) && (validateStartTime.getMinutes() > 30))
        {
            $('#start_event').datetimepicker('reset');
        }
        else
        {
            calcDifferenceBetweenTwoDates();
            $("#start_event input").blur();
        }   

        // revalidate the readonly field to hide the error message if field is valid
        $('#start_event').valid();
    }

    function validateEndDateBusinessHours() 
    {
        var validateEndTime = new Date($('#end_event').val());
        if ((validateEndTime.getDay() == 0) || (validateEndTime.getDay() == 6)) {
            $('#end_event').datetimepicker('reset');
            alert("Sorry! Weekend date time not allow.");
        }
        else if ((validateEndTime.getHours() < 9) || (validateEndTime.getHours() > 17))
        {
            $('#end_event').datetimepicker('reset');
        }
        else if ((validateEndTime.getHours() == 17) && (validateEndTime.getMinutes() > 0))
        {
            $('#end_event').datetimepicker('reset');
        }
        else
        {
            calcDifferenceBetweenTwoDates();
        }
    }
    // -------------- End of validate the Business hours for start and end date/time -------------- //


    // -------------- Function that doesn't allow past date times -------------- //
    // credit for this function to: https://thecodedeveloper.com/disable-past-date-time/
    // also made few adjustemnt to alow range between the start and end date/time 
    var checkPastTimeStart = function(inputDateTime) {
        if (typeof(inputDateTime) != "undefined" && inputDateTime !== null) {
            var current = new Date();

            //check past year and month
            if (inputDateTime.getFullYear() < current.getFullYear()) {
                $('#start_event').datetimepicker('reset');
                alert("Sorry! Past date time not allow.");
            } else if ((inputDateTime.getFullYear() == current.getFullYear()) && (inputDateTime.getMonth() < current.getMonth())) {
                $('#start_event').datetimepicker('reset');
                alert("Sorry! Past date time not allow.");
            }
        
            // 'this' is jquery object datetimepicker
            // check input date equal with today date
            if (inputDateTime.getDate() == current.getDate()) {
                if (inputDateTime.getHours() < current.getHours()) {
                    $('#start_event').datetimepicker('reset');
                }
                this.setOptions({
                    minTime: current.getHours() + ':00', //here pass current time hour
                    maxTime:'17:00',
                    maxDate:$('#end_event').val()?$('#end_event').val():false,
                });
            } else {
                this.setOptions({
                    minTime:  '09:00',
                    maxTime:'17:00',
                    maxDate:$('#end_event').val()?$('#end_event').val():false,
                });
            }
        }
    };


    var checkPastTimeEnd = function(inputDateTime) {
        if (typeof(inputDateTime) != "undefined" && inputDateTime !== null) {
            var current = new Date();

            //check past year and month
            if (inputDateTime.getFullYear() < current.getFullYear()) {
                $('#end_event').datetimepicker('reset');
                alert("Sorry! Past date time not allow.");
            } else if ((inputDateTime.getFullYear() == current.getFullYear()) && (inputDateTime.getMonth() < current.getMonth())) {
                $('#end_event').datetimepicker('reset');
                alert("Sorry! Past date time not allow.");
            }
            
            // reste error message from jquery validate in case we need to show another custom message
            $('#end_event').valid();
       
            // 'this' is jquery object datetimepicker
            // check input date equal with today date
            if (inputDateTime.getDate() == current.getDate()) {
                if (inputDateTime.getHours() < current.getHours()) {
                    $('#end_event').datetimepicker('reset');
                }
                this.setOptions({
                    minTime: current.getHours() + ':00', 
                    maxTime:'17:30',
                    minDate:$('#start_event').val()?$('#start_event').val():current,
                });
            } else {
                this.setOptions({
                    minTime:  '09:30',
                    maxTime:'17:30',
                    minDate:$('#start_event').val()?$('#start_event').val():current,
                });
            }
        }
    };
    // -------------- End of function that doesn't allow past date times -------------- //


    // use moment to set date format
    $.datetimepicker.setDateFormatter('moment');
 
    var today = new Date();
    // https://plugins.jquery.com/datetimepicker/ -> official website: https://xdsoft.net/jqplugins/datetimepicker/
    $('#start_event').datetimepicker({
        minDate : 0,
        step: 30,
        yearStart : today.getFullYear(),
        disabledWeekDays:[0, 6],
        disabledDates: publicholidays,
        highlightedDates: defaulthighlights,

        format: "YYYY/MM/DD H:mm",
        formatTime: 'H:mm',
        formatDate: 'YYYY-MM-DD',

        onChangeDateTime:checkPastTimeStart,
        onShow:checkPastTimeStart,
        onClose: function(){ validateStartDateBusinessHours() }
    });

    $('#end_event').datetimepicker({
        minDate : 0,
        step: 30,
        yearStart : today.getFullYear(),
        disabledWeekDays:[0, 6],
        disabledDates: publicholidays,
        highlightedDates: defaulthighlights,

        format: "YYYY/MM/DD H:mm",
        formatTime: 'H:mm',
        formatDate: 'YYYY-MM-DD',

        onChangeDateTime:checkPastTimeEnd,
        onShow:checkPastTimeEnd,
        onClose: function(){ validateEndDateBusinessHours() }
    });


    // For Datetimepicker only to use the select calendar - alert on user change
    // Datetimepicker fields are readonly by default, but if user want to type or to paste something into the field reset the field and the auto labour hour
    // credit https://stackoverflow.com/questions/24723537/restrict-user-from-changing-input-fields-date-unless-when-using-datepicker
    $("#start_event").on('keyup',function(){
        alert("Please select date time using datetimepicker");
        $("#labourHours").val('');
        $(this).val("");    
    });

    $("#end_event").on('keyup',function(){
        alert("Please select date time using datetimepicker");
        $("#labourHours").val('');
        $(this).val("");
    });

});
