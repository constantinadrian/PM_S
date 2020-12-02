import os
import calendar

from flask import request, session
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from datetime import date, timedelta
from sql import convertTupleSQLtoDict

# Create engine object to connect to database
engine = create_engine(os.getenv("DATABASE_URL"))

# Use scoped session to separate user interactions with database
# https://docs.sqlalchemy.org/en/13/orm/contextual.html
db = scoped_session(sessionmaker(bind=engine))


def checkStatus(companyID, userId):

    pmStatus = db.execute("SELECT status, jobLabor.id FROM companyDetails INNER JOIN jobDetails ON companyDetails.id = jobDetails.companyDetails_id INNER JOIN joblabor ON jobDetails.id = joblabor.jobDetails_id WHERE companyDetails.user_id = :companyDetailsUser_id AND jobDetails.user_id = :jobDetailsUuser_id AND joblabor.user_id = :jobLabourUser_id AND companyDetails.id = :companyDetails_id ", {'companyDetailsUser_id': userId, 'jobDetailsUuser_id': userId, 'jobLabourUser_id': userId, 'companyDetails_id': companyID}).fetchall()

    if pmStatus[0]["status"] == 'Complete':
        return pmStatus[0]["id"]

    return None


# Get all Pm the has been complete
def completePm(userId):

    getCompletePm = db.execute("SELECT companyName, landlineNumber, contactName, technician, title, to_char(dateofissue, 'YYYY-MM-DD') dateofissue, to_char(duedate, 'YYYY-MM-DD') duedate, invoiceNumber FROM companyDetails INNER JOIN jobDetails ON companyDetails.id = jobDetails.companyDetails_id INNER JOIN joblabor ON jobDetails.id = joblabor.jobDetails_id INNER JOIN invoice ON jobLabor.id = invoice.jobLabor_id WHERE companyDetails.user_id = :companyDetailsUser_id AND jobDetails.user_id = :jobDetailsUuser_id AND joblabor.user_id = :jobLabourUser_id AND invoice.user_id = :invoiceUser_id AND status = 'Complete' ORDER BY invoice.id", {'companyDetailsUser_id': userId, 'jobDetailsUuser_id': userId, 'jobLabourUser_id': userId, 'invoiceUser_id': userId}).fetchall()

    getCompletePm = convertTupleSQLtoDict(getCompletePm)

    return getCompletePm


def getLastInvoice(userId):
    invoiceNumber = db.execute("SELECT invoiceNumber FROM invoice WHERE user_id = :user_id ORDER BY id DESC;", {'user_id': userId}).fetchall()

    invoiceNumber = convertTupleSQLtoDict(invoiceNumber)

    if not invoiceNumber:
        return None

    return invoiceNumber[0]['invoicenumber']


# increment invoice number function from
# https://stackoverflow.com/questions/28198883/auto-increament-the-invoice-number-in-django-backend-for-new-invoice
def incrementInvoiceNumber(userId):

    last_invoice = getLastInvoice(userId)
    if not last_invoice:
        return 'PM-S001'
    invoice_no = last_invoice
    invoice_int = int(invoice_no.split('PM-S00')[-1])
    new_invoice_int = invoice_int + 1
    new_invoice_no = 'PM-S00' + str(new_invoice_int)

    return new_invoice_no


def getUserCompanyVaxRate(userId):
    companyVaxRate = db.execute("SELECT userCompanyVatRate FROM usersDetails WHERE user_id = :user_id", {'user_id': userId}).fetchall()

    companyVaxRate = convertTupleSQLtoDict(companyVaxRate)

    return companyVaxRate[0]["usercompanyvatrate"]


def createInvoice(jobLaborId, pmDetailsChanges, userId):

    pmInvoice = {'invoiceNumber': None, 'dateOfIssue': None, 'dueDate': None, 'subTotal': None, 'taxRate': None, 'tax': None, 'totalPrice': None}

    pmInvoice['invoiceNumber'] = incrementInvoiceNumber(userId)
    pmInvoice['dateOfIssue'] = date.today()
    pmInvoice['dueDate'] = date.today() + timedelta(30)
    pmInvoice['subTotal'] = float(str(pmDetailsChanges['jobPrice'])) + float(str(pmDetailsChanges['labourTotalPrice']))
    pmInvoice['taxRate'] = getUserCompanyVaxRate(userId)
    pmInvoice['tax'] = ((float(str(pmInvoice['subTotal']))) / 100) * float(str(pmInvoice['taxRate']))
    pmInvoice['totalPrice'] = pmInvoice['subTotal'] + pmInvoice['tax']

    # Insert new invoice
    getInvoice_id = db.execute("INSERT INTO invoice (invoiceNumber, dateOfIssue, dueDate, subTotal, taxRate, tax, totalPrice, user_id, jobLabor_id) VALUES (:invoiceNumber, :dateOfIssue, :dueDate, :subTotal, :taxRate, :tax, :totalPrice, :user_id, :jobLabor_id) RETURNING id", {'invoiceNumber': pmInvoice['invoiceNumber'], 'dateOfIssue': pmInvoice['dateOfIssue'], 'dueDate': pmInvoice['dueDate'], 'subTotal': pmInvoice['subTotal'], 'taxRate': pmInvoice['taxRate'], 'tax': pmInvoice['tax'], 'totalPrice': pmInvoice['totalPrice'], 'user_id': userId, 'jobLabor_id': jobLaborId}).fetchone()[0]

    # Save (commit) the changes
    db.commit()

    return getInvoice_id
