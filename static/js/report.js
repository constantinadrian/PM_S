$(document).ready(function () {
    // -------------- Chart JS functionality -------------- //
    // https://www.chartjs.org/docs/latest/

    // For pie chart
    var ctx = document.getElementById('myPieChart');
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            datasets: [{
                data: [ currentMonthReport[0]['lowpriority'], currentMonthReport[0]['mediumpriority'], currentMonthReport[0]['criticalpriority'] ],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'Blue',
                'Orange',
                'Red'
            ]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    // For bar chart
    var ctx2 = document.getElementById('myBarChart').getContext('2d');
    var myChart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Blue', 'Orange', 'Red', 'Green' ],
            datasets: [{
                label: '# PM\'s status for current month',
                data: [ currentMonthReport[0]['lowpriority'], currentMonthReport[0]['mediumpriority'], currentMonthReport[0]['criticalpriority'], currentMonthReport[0]['complete']],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 159, 64, 0.3)',
                    'rgba(255, 99, 132, 0.2)',                    
                    'rgba(73, 245, 46, 0.3)',                    
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',                    
                    'rgba(75, 192, 192, 1)'                    
                ],
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });


    // For Line Chart
    var ctx3 = document.getElementById('myLineChart').getContext('2d');
    var myLineChart = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octomber', 'November', 'December'],
            datasets : [{
                label : 'PM Work Orders Completed $',
                data: [ currentYearWorkOrdersCompleted[0]['january'], currentYearWorkOrdersCompleted[0]['february'], currentYearWorkOrdersCompleted[0]['march'], currentYearWorkOrdersCompleted[0]['april'], currentYearWorkOrdersCompleted[0]['may'], currentYearWorkOrdersCompleted[0]['june'], currentYearWorkOrdersCompleted[0]['july'], currentYearWorkOrdersCompleted[0]['august'], currentYearWorkOrdersCompleted[0]['september'], currentYearWorkOrdersCompleted[0]['octomber'], currentYearWorkOrdersCompleted[0]['november'], currentYearWorkOrdersCompleted[0]['december'], ],
                fill: false,
                borderColor: 'rgb(8, 154, 0)',
                lineTension: 0.1
            }],
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    stacked: true
                }]
            }
        }
    });

});