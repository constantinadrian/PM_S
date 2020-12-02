
// -------------- For datatable -------------- //
// https://datatables.net/
$(document).ready(function () {
	$('#pm-table').DataTable({

		// put full paging on bottoms of table
		"pagingType": "full_numbers",

		// order data in first column in asc order
		"order": [[0, "desc"]],

		// hide the show entry
		// dom: 'Bfrtip',

		// change the show entry list
		lengthMenu: [[ 10, 25, 50, 100, -1 ],[ 10, 25, 50, 100, 'All']],
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

	// append the buttons to div #buttons
	initComplete:function(){
		var activeTable = $('#pm-table').DataTable();
		activeTable.buttons().container().prependTo("#buttons");
		}
	});
});
// -------------- End datatable -------------- //


// -------------- For initialize all tooltips on a page - https://getbootstrap.com/docs/4.5/components/tooltips/
$(function () {
    $('[data-toggle="tooltip"]').tooltip({
        trigger : 'hover'
    });
});
// -------------- End of initialize all tooltips on a page


// -------------- For create pdf invoice -------------- //
// https://pdfmake.github.io/docs/0.1/

var invoiceNumber;
var pdfDetails;
// get all a link buttons with data-pdf atribute
var buttons = document.querySelectorAll("a[data-pdf]");
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function(event) {
    	invoiceNumber = this.getAttribute('data-pdf');

		for(var j = 0, l = compInvoices.length; j < l; j++)
		{
			if (typeof compInvoices[j][invoiceNumber] !== "undefined")
			{
				// console.log(compInvoices[j][invoiceNumber])
				pdfDetails = compInvoices[j][invoiceNumber];
				generatePdf();
			}
			
		}
    });
}

// function that generate the pdf invoice
// made this function design with the help of https://pdfmake.github.io/docs/0.1/ - playgroung
function generatePdf()
{

    var dd = {

		content: [
			{text: 'INVOICE', style: 'header'},

			{
			margin: [0, 0, 0, 30],
				columns: [

					{
						width: 150,
						style: 'subheaderTable',
						table: {
							headerRows: 1,
							body: [
								[userCompDetails[0].usercompanyname],
								[userCompDetails[0].useraddress1 + ' ' + userCompDetails[0].useraddress1 + ' ' + userCompDetails[0].useraddress1],
								[userCompDetails[0].usercity + ' ' + userCompDetails[0].userzipcode],
								[userCompDetails[0].usercountry],
							]
						},
						layout: 'noBorders'
					},
					{
						width: 150,
						style: 'subheaderTable',
						table: {
							headerRows: 1,
							body: [
								['CRN:' + ' ' + userCompDetails[0].usercompanyregistrationnumber],
								[userCompDetails[0].userphonenumber],
								[userCompDetails[0].userlandlinenumber],
								[userCompDetails[0].useremail],
							]
						},
						layout: 'noBorders'
					}
				]

			},

			{
				columns: [

					{
						width: 430,
						style: 'subheaderTable',
						table: {
							headerRows: 1,
							body: [
								[{text: 'Bill To', style: 'subheaderTableHeader'}],
								[pdfDetails.companyname],
								[pdfDetails.address1 + ' ' + pdfDetails.address2 + ' ' + pdfDetails.address3],
								[pdfDetails.city + ' ' + pdfDetails.zipcode],
								[userCompDetails[0].usercountry],
							]
						},
						layout: 'noBorders'
					},
					{
						style: 'subheaderTable',
						table: {
							headerRows: 1,
							body: [
								[{text: 'Invoice No.', style: 'subheaderTableHeader'}],
								[invoiceNumber],
								[{text: 'Date of issue', style: 'subheaderTableHeader'}],
								[pdfDetails.dateofissue],
								[{text: 'Due Date', style: 'subheaderTableHeader'}],
								[pdfDetails.duedate],
							]
						},
						layout: 'noBorders'
					}
				]
			},
			{
				style: 'table',
				table: {
					widths: [290, 30, 70, 80],
					heights: 20,
					headerRows: 1,
					body: [
						[{text: 'Description', style: 'tableHeader',}, {text: 'QTY', style: 'tableHeader'}, {text: 'Unit Price', style: 'tableHeader'}, {text: 'Amount', style: 'tableHeader'}],
						[pdfDetails.title, pdfDetails.quantity, pdfDetails.jobprice, pdfDetails.jobprice],
						[pdfDetails.labourdescription, pdfDetails.labourhours, pdfDetails.labourrate, pdfDetails.labourtotalprice],
						['', '', '', ''],
						['', '', '', ''],
						['', '', '', ''],
						['', '', '', ''],
						['', '', '', ''],
						['', '', '', ''],
						['', '', '', ''],
						['', '', '', ''],
						['', '', '', ''],
						['', '', '', ''],
					]

				},

				layout: {
					hLineWidth: function (i, node) {
						return (i === 0 || i === node.table.body.length) ? 1 : 1;
					},
					vLineWidth: function (i, node) {
						return (i === 0 || i === node.table.widths.length) ? 0 : 1;
					},
					hLineColor: function (i, node) {
						return 'black';
					},
					vLineColor: function (i, node) {
						return 'black';
					},
					hLineStyle: function (i, node) {
						if (i === 0 || i === node.table.body.length) {
							return null;
						}
						return {dash: {length: 1, space: 2}};
					},
					vLineStyle: function (i, node) {
						if (i === 0 || i === node.table.widths.length) {
							return null;
						}
						return {dash: {length: 2}};
					},
				}
			},
			{
				table: {
					widths: [290, 30, 70, 80],
					heights: 10,

					body: [

						[
							{
								rowSpan: 4,
								border: [false, false, false, false],
								fillColor: '#d4e7f5',
								text: ''
							},
							{
								colSpan: 2,
								border: [false, false, false, false], 
								fillColor: '#b5d5ed',
								text: 'SUBTOTAL'
							},
							'',
							{
								border: [false, false, false, false],
								fillColor: '#d4e7f5',
								text: '$' + ' ' + pdfDetails.subtotal
							}
						],
						[
							'',
							{
								colSpan: 2,
								border: [false, false, false, false],
								fillColor: '#b5d5ed',
								text: 'TAX RATE'
							},
							'',
							{
								border: [false, false, false, false],
								fillColor: '#d4e7f5',
								text: pdfDetails.taxrate + ' ' + '%'
							}
						],
						[
							'',
							{
								colSpan: 2,
								border: [false, false, false, false],
								fillColor: '#b5d5ed',
								text: 'TAX'
							},
							'',
							{
								border: [false, false, false, false],
								fillColor: '#d4e7f5',
								text: '$' + ' ' + pdfDetails.tax
							}
						],
						[
							'',
							{
								colSpan: 2,
								border: [false, false, false, false],  
								fillColor: '#b5d5ed',
								text: 'TOTAL'
							},
							'',
							{
								border: [false, false, false, false],
								fillColor: '#d4e7f5',
								text: '$' + ' ' + pdfDetails.totalprice
							}
						],
					],
				},
			},

		],
		footer: {
			columns: [
				{
					alignment: 'center',
					text: ['Thank you for your business!\n', {text: 'If you have any question about this invoince, please contact me!', italics: true, fontSize: 8, color: '#828A95'}]
				}
			],

			margin: [10, 0]
		},

		styles: {
			header: {
				fontSize: 28,
				color: '#0c78c8',
				bold: true,
				margin: [0, 0, 0, 20],
				alignment: 'center'
			},
			subheaderTable:
			{
				margin: [ 5, 2, 2, 2 ],
				fontSize: 10
			},
			subheaderTableHeader: {
				fontSize: 10,
				margin: [ 5, 2, 2, 2 ],
				bold: true,
				color: 'white',
				fillColor: '#0c78c8'
			},
			table: {
				margin: [0, 30, 0, 0],
				fontSize: 10,
				fillColor: '#e7f3f7',
			},
			tableHeader: {
				fontSize: 12,
				margin: [ 5, 2, 2, 2 ],
				bold: true,
				color: 'white',
				fillColor: '#0c78c8'
			},
		}
	};
// Now with all the manipulated data, create the pdf.
// pdfMake.createPdf(dd).open();
pdfMake.createPdf(dd).download('Invoice.pdf');
}
// -------------- End of create pdf invoice -------------- //

