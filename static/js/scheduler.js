// JS for Calendar 
$(document).ready(function() {

    // this function from here: 
    // https://stackoverflow.com/questions/41908295/fullcalendar-change-view-for-mobile-devices
    window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
    };
    // end of function

    // convert data_event for fullcalendar
    // use the slice method on string to return the right format
    // credit https://stackoverflow.com/questions/6291225/convert-date-from-thu-jun-09-2011-000000-gmt0530-india-standard-time-to
    function convert(data_event) {
        var date = new Date(data_event);
        // use the getMonth() method add 1 so we can display the right month in fullcalendar (1 to 12, not 0 - 11)
        var month = ("0" + (date.getMonth()+1)).slice(-2);
        var day  = ("0" + date.getDate()).slice(-2);
        var hours  = ("0" + date.getHours()).slice(-2);
        var minutes = ("0" + date.getMinutes()).slice(-2);
        return [ date.getFullYear(), month, day, hours, minutes ].join("-");
    }
    
    
    // declare array events
    var events = [];
    // iterate thru data array and to set up events in calendar
    // display data in calendar credit https://www.youtube.com/watch?v=wA-Iy6ThYz4
    $.each(data, function(index, value){
        // console.log(typeof(moment(v.end_event, 'YYYY-M-D H:mm')))
        // create an event object
        events.push({
            title: value.title,
            start: moment((convert(value.start_event)), 'YYYY-M-D H:mm'),
            end: moment((convert(value.end_event)), 'YYYY-M-D H:mm'),
            description: value.jobdescription,
            color: value.status == 'Complete' ? 'green' : value.jobpriority == 'Critical Priority' ? 'red' : value.jobpriority == 'Medium Priority' ? 'orange' : 'blue',
            textColor: 'black',
            borderColor: 'black'
        });
    });
    // console.log(events);
                
    // Removes elements, events handlers, and internal data.
    $('#calendar').fullCalendar('destroy');
    // define the fullcalendar 
    $('#calendar').fullCalendar({
        slotDuration: '00:15',
        // set up defauls business hours - same business hours as in datetimepicker 
        minTime: '9:00',
        maxTime: '17:00',

        // theme: true,
        themeSystem: 'flatly',

        // change view for mobile screen
        // https://stackoverflow.com/questions/41908295/fullcalendar-change-view-for-mobile-devices
        defaultView: window.mobilecheck() ? "basicDay" : "month",

        timeFormat: 'H:mm', 
        contentHeight: 600,

        // calender header
        header:{
            left:'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,list'
        },
        // This is in case we have multiple events in on cell and doesn't fit into cell, a '+' sign will appear
        eventLimit: true,

        // display events from db
        events: events,

        // credit https://www.youtube.com/watch?v=wA-Iy6ThYz4
        eventClick: function(event) {
            $('#myModal #eventTitle').text(event.title);

            // create new element 'div'
            var $description = $('<div/>');

            // append start date
            $description.append($('<p/>').html('<strong>Start: </strong>' + event.start.format("DD/MM/YYYY HH:mm")));

            // append end date
            $description.append($('<p/>').html('<strong>End: </strong>' + event.end.format("DD/MM/YYYY HH:mm")));

            // append description
            $description.append($('<p/>').html('<strong>Description: </strong>' + event.description));
            
            // append new element created 'description', 'div', to modal body
            $('#myModal .modal-body').empty().html($description);

            $('#myModal').modal();
        }
    });
});
