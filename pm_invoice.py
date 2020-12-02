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


def userCompanyDetails(userId):
    getUserCompanyDetails = db.execute("SELECT userCompanyName, userAddress1, userAddress2, userAddress3, userCity, userCountry, userZipCode, userCompanyRegistrationNumber, userPhoneNumber, userLandlineNumber, userEmail, userContactName FROM usersDetails WHERE user_id = :user_id", {'user_id': userId}).fetchall()

    getUserCompanyDetails = convertTupleSQLtoDict(getUserCompanyDetails)

    return getUserCompanyDetails


# Make a structure for 'pdf make' to access each company invoice by it's key
def eachCompanyInvoice(key, row):
    return {key: row}


def allCompanyInvoices(data):
    allInvoices = []
    for row in data:
        for key, value in row.items():
            if key == 'invoicenumber':
                eachInvoice = eachCompanyInvoice(row[key], row)
                allInvoices.append(eachInvoice)
                continue
    return allInvoices


def companyInvoices(userId):
    getCompanyInvoicesDetails = db.execute("SELECT companyName, address1, address2, address3, city, zipCode, title, quantity, jobPrice, labourDescription, labourHours, labourRate, labourTotalPrice, invoiceNumber, to_char(dateOfIssue, 'YYYY-MM-DD') dateOfIssue, to_char(dueDate, 'YYYY-MM-DD') dueDate, subTotal, taxRate, tax, totalPrice FROM companyDetails INNER JOIN jobDetails ON companyDetails.id = jobDetails.companyDetails_id INNER JOIN jobLabor ON jobDetails.id = jobLabor.jobDetails_id INNER JOIN invoice ON jobLabor.id = invoice.jobLabor_id WHERE companyDetails.user_id = :companyDetailsUser_id AND jobDetails.user_id = :jobDetailsUuser_id AND joblabor.user_id = :jobLabourUser_id AND invoice.user_id = :invoiceUser_id AND status = 'Complete' ORDER BY companyDetails.id", {'companyDetailsUser_id': userId, 'jobDetailsUuser_id': userId, 'jobLabourUser_id': userId, 'invoiceUser_id': userId}).fetchall()

    getCompanyInvoicesDetails = convertTupleSQLtoDict(getCompanyInvoicesDetails)

    if not getCompanyInvoicesDetails:
        return None

    # create a nested dictiionary with all data
    invoices = allCompanyInvoices(getCompanyInvoicesDetails)

    return invoices
