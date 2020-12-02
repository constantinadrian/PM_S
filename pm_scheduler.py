import os
import calendar

from flask import request, session
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from datetime import datetime, date
from sql import convertTupleSQLtoDict
import helpers
import pm_countrylist


# Create engine object to connect to database
engine = create_engine(os.getenv("DATABASE_URL"))

# Use scoped session to separate user interactions with database
# https://docs.sqlalchemy.org/en/13/orm/contextual.html
db = scoped_session(sessionmaker(bind=engine))


# Insert PM in database
def insertNewPm(formData, userId):
    pmDetails = {'companyName': None, 'address1': None, 'address2': None, 'address3': None, 'phoneNumber': None, 'landlineNumber': None, 'email': None, 'contactName': None, 'city': None, 'zipCode': None, 'technician': None, 'jobType': None, 'jobDescription': None, 'quantity': None, 'jobPrice': None, 'start_event': None, 'end_event': None, 'labourDescription': None, 'labourHours': None, 'labourRate': None, 'labourTotalPrice': None, 'jobPriority': None, 'status': None}

    for key, value in formData:
        pmDetails[key] = value.strip()

    pmDetails['labourTotalPrice'] = float(str(pmDetails['labourHours'])) * float(str(pmDetails['labourRate']))

    # Insert data into database
    db.execute("BEGIN TRANSACTION")

    company_id = db.execute("INSERT INTO companyDetails (companyName, address1, address2, address3, city, zipCode, contactName, phoneNumber, landlineNumber, email, user_id) VALUES (:companyName, :address1, :address2, :address3, :city, :zipCode, :contactName, :phoneNumber, :landlineNumber, :email, :user_id)RETURNING id", {'companyName': pmDetails['companyName'], 'address1': pmDetails['address1'], 'address2': pmDetails['address2'], 'address3': pmDetails['address3'], 'city': pmDetails['city'], 'zipCode': pmDetails['zipCode'], 'contactName': pmDetails['contactName'], 'phoneNumber': pmDetails['phoneNumber'], 'landlineNumber': pmDetails['landlineNumber'], 'email': pmDetails['email'], 'user_id': userId}).fetchone()[0]

    jobDetails_id = db.execute("INSERT INTO jobDetails (title, jobDescription, start_event, end_event, jobPrice, jobPriority, status, technician, user_id, companyDetails_id) VALUES (:jobType, :jobDescription, :start_event, :end_event, :jobPrice, :jobPriority, :status, :technician, :user_id, :companyDetails_id) RETURNING id", {'jobType': pmDetails['jobType'], 'jobDescription': pmDetails['jobDescription'], 'start_event': pmDetails['start_event'], 'end_event': pmDetails['end_event'], 'jobPrice': pmDetails['jobPrice'], 'jobPriority': pmDetails['jobPriority'], 'status': pmDetails['status'], 'technician': pmDetails['technician'], 'user_id': userId, 'companyDetails_id': company_id}).fetchone()[0]

    jobLabor_id = db.execute("INSERT INTO joblabor (labourHours, labourRate, labourTotalPrice, user_id, jobDetails_id) VALUES (:labourHours, :labourRate, :labourTotalPrice, :user_id, :jobDetails_id) RETURNING id", {'labourHours': pmDetails['labourHours'], 'labourRate': pmDetails['labourRate'], 'labourTotalPrice': pmDetails['labourTotalPrice'], 'user_id': userId, 'jobDetails_id': jobDetails_id}).fetchone()[0]

    db.execute("COMMIT TRANSACTION")

    db.commit()

    return jobLabor_id


# Get all PM from database
def getAllPm(userId):

    allPm = db.execute("SELECT companyName, address1, address2, address3, phoneNumber, landlineNumber, email, contactName, city, zipCode, technician, title, jobDescription, quantity, jobPrice, to_char(start_event, 'YYYY-MM-DD HH24:MI') start_event, to_char(end_event, 'YYYY-MM-DD HH24:MI') end_event, labourDescription, labourHours, labourRate, labourTotalPrice, jobPriority, status FROM companyDetails INNER JOIN jobDetails ON companyDetails.id = jobDetails.companyDetails_id INNER JOIN joblabor ON jobDetails.id = joblabor.jobDetails_id WHERE companyDetails.user_id = :companyDetailsUser_id AND jobDetails.user_id = :jobDetailsUuser_id AND joblabor.user_id = :jobLabourUser_id ORDER BY companyDetails.id", {'companyDetailsUser_id': userId, 'jobDetailsUuser_id': userId, 'jobLabourUser_id': userId}).fetchall()

    allPm = convertTupleSQLtoDict(allPm)

    return allPm


# Check if the PM exist in database
def pmExist(requestForm, userId):
    oldPmDetails = {'companyName': None, 'address1': None, 'address2': None, 'address3': None, 'phoneNumber': None, 'landlineNumber': None, 'email': None, 'contactName': None, 'city': None, 'zipCode': None, 'technician': None, 'jobType': None, 'jobDescription': None, 'jobQuantity': None, 'jobPrice': None, 'start_event': None, 'end_event': None, 'labourDescription': None, 'labourHours': None, 'labourRate': None, 'labourTotalPrice': None, 'jobPriority': None, 'status': None}

    # company detail
    oldPmDetails['companyName'] = requestForm.get('oldData-companyName').strip()
    oldPmDetails['address1'] = requestForm.get('oldData-address1').strip()
    oldPmDetails['address2'] = requestForm.get('oldData-address2').strip()
    oldPmDetails['address3'] = requestForm.get('oldData-address3').strip()
    oldPmDetails['phoneNumber'] = requestForm.get('oldData-phoneNumber').strip()
    oldPmDetails['landlineNumber'] = requestForm.get('oldData-landlineNumber').strip()
    oldPmDetails['email'] = requestForm.get('oldData-email').strip()
    oldPmDetails['contactName'] = requestForm.get('oldData-contactName').strip()
    oldPmDetails['city'] = requestForm.get('oldData-city').strip()
    oldPmDetails['zipCode'] = requestForm.get('oldData-zipCode').strip()
    # job detail
    oldPmDetails['technician'] = requestForm.get('oldData-technician').strip()
    oldPmDetails['jobType'] = requestForm.get('oldData-jobType').strip()
    oldPmDetails['jobDescription'] = requestForm.get('oldData-jobDescription').strip()
    oldPmDetails['jobQuantity'] = requestForm.get('oldData-jobQuantity').strip()
    oldPmDetails['jobPrice'] = requestForm.get('oldData-jobPrice').strip()
    oldPmDetails['start_event'] = requestForm.get('oldData-start_event').strip()
    oldPmDetails['end_event'] = requestForm.get('oldData-end_event').strip()
    oldPmDetails['labourDescription'] = requestForm.get('oldData-labourDescription').strip()
    oldPmDetails['labourHours'] = requestForm.get('oldData-labourHours').strip()
    oldPmDetails['labourRate'] = requestForm.get('oldData-labourRate').strip()
    oldPmDetails['labourTotalPrice'] = requestForm.get('oldData-labourTotalPrice').strip()
    oldPmDetails['jobPriority'] = requestForm.get('oldData-jobPriority').strip()
    oldPmDetails['status'] = requestForm.get('oldData-status').strip()

    company_id = db.execute("SELECT companyDetails.id FROM companyDetails INNER JOIN jobDetails ON companyDetails.id = jobDetails.companyDetails_id INNER JOIN joblabor ON jobDetails.id = joblabor.jobDetails_id WHERE companyDetails.user_id = :companyDetailsUser_id AND jobDetails.user_id = :jobDetailsUuser_id AND joblabor.user_id = :jobLabourUser_id AND companyName = :companyName AND address1 = :address1 AND address2 = :address2 AND address3 = :address3 AND phoneNumber = :phoneNumber AND landlineNumber = :landlineNumber AND email = :email AND contactName = :contactName AND city = :city AND zipCode = :zipCode AND technician = :technician AND title = :jobType AND jobDescription = :jobDescription AND quantity = :quantity AND start_event = :start_event AND end_event = :end_event AND jobPrice = :jobPrice AND jobPriority = :jobPriority AND status = :status AND labourDescription = :labourDescription AND labourHours = :labourHours AND labourRate = :labourRate AND labourTotalPrice = :labourTotalPrice", {'companyDetailsUser_id': userId, 'jobDetailsUuser_id': userId, 'jobLabourUser_id': userId, 'companyName': oldPmDetails['companyName'], 'address1': oldPmDetails['address1'], 'address2': oldPmDetails['address2'], 'address3': oldPmDetails['address3'], 'phoneNumber': oldPmDetails['phoneNumber'], 'landlineNumber': oldPmDetails['landlineNumber'], 'email': oldPmDetails['email'], 'contactName': oldPmDetails['contactName'], 'city': oldPmDetails['city'], 'zipCode': oldPmDetails['zipCode'], 'technician': oldPmDetails['technician'], 'jobType': oldPmDetails['jobType'], 'jobDescription': oldPmDetails['jobDescription'], 'quantity': oldPmDetails['jobQuantity'], 'start_event': oldPmDetails['start_event'], 'end_event': oldPmDetails['end_event'], 'jobPrice': oldPmDetails['jobPrice'], 'jobPriority': oldPmDetails['jobPriority'], 'status': oldPmDetails['status'], 'labourDescription': oldPmDetails['labourDescription'], 'labourHours': oldPmDetails['labourHours'], 'labourRate': oldPmDetails['labourRate'], 'labourTotalPrice': oldPmDetails['labourTotalPrice']}).fetchone()

    # If no company_id if found PM doesn't exist and resturn None
    if not company_id:
        return None

    # If PM exist return the oldPmDetails in a dict structure
    return oldPmDetails


# Check if user made any changes in PM
def checkChangesInPm(formData, oldPmDetails):
    # remove these key before we check for any changes because they where not from user direct input
    oldPmDetails.pop('jobQuantity', None)
    oldPmDetails.pop('labourDescription', None)
    oldPmDetails.pop('labourTotalPrice', None)

    pmDetails = {'companyName': None, 'address1': None, 'address2': None, 'address3': None, 'phoneNumber': None, 'landlineNumber': None, 'email': None, 'contactName': None, 'city': None, 'zipCode': None, 'technician': None, 'jobType': None, 'jobDescription': None, 'quantity': None, 'jobPrice': None, 'start_event': None, 'end_event': None, 'labourDescription': None, 'labourHours': None, 'labourRate': None, 'labourTotalPrice': None, 'jobPriority': None, 'status': None}

    for key, value in formData:
        pmDetails[key] = value.strip()

    # check if any changes was made to the PM by checking if oldPmDetails is a subset on pmDetails
    # if all key, value pairs from oldPmDetails are in pmDetails, the user hasn't made any update to PM
    # and return none
    if oldPmDetails.items() <= pmDetails.items():
        return None

    pmDetails['labourTotalPrice'] = float(str(pmDetails['labourHours'])) * float(str(pmDetails['labourRate']))

    return pmDetails


# Delete PM from database
def deletePm(oldPmDetails, userId):

    # Delete data from database with one transaction
    db.execute("BEGIN TRANSACTION")

    jobDetails_id_FK = db.execute("DELETE FROM joblabor WHERE labourDescription = :labourDescription AND labourHours = :labourHours AND labourRate = :labourRate AND labourTotalPrice = :labourTotalPrice AND user_id = :joblabor_user_id AND jobDetails_id IN (SELECT id FROM jobDetails WHERE title = :jobType AND jobDescription = :jobDescription AND quantity = :quantity AND start_event = :start_event AND end_event = :end_event AND jobPrice = :jobPrice AND jobPriority = :jobPriority AND status = :status AND technician = :technician AND user_id = :jobDetails_user_id AND companyDetails_id IN (SELECT id FROM companyDetails WHERE companyName = :companyName AND address1 = :address1 AND address2 = :address2 AND address3 = :address3 AND city = :city AND zipCode = :zipCode AND contactName = :contactName AND phoneNumber = :phoneNumber AND landlineNumber = :landlineNumber AND email = :email AND user_id = :companyDetails_user_id)) RETURNING jobDetails_id", {'labourDescription': oldPmDetails['labourDescription'], 'labourHours': oldPmDetails['labourHours'], 'labourRate': oldPmDetails['labourRate'], 'labourTotalPrice': oldPmDetails['labourTotalPrice'], 'joblabor_user_id': userId, 'jobType': oldPmDetails['jobType'], 'jobDescription': oldPmDetails['jobDescription'], 'quantity': oldPmDetails['jobQuantity'], 'start_event': oldPmDetails['start_event'], 'end_event': oldPmDetails['end_event'], 'jobPrice': oldPmDetails['jobPrice'], 'jobPriority': oldPmDetails['jobPriority'], 'status': oldPmDetails['status'], 'technician': oldPmDetails['technician'], 'jobDetails_user_id': userId, 'companyName': oldPmDetails['companyName'], 'address1': oldPmDetails['address1'], 'address2': oldPmDetails['address2'], 'address3': oldPmDetails['address3'], 'city': oldPmDetails['city'], 'zipCode': oldPmDetails['zipCode'], 'contactName': oldPmDetails['contactName'], 'phoneNumber': oldPmDetails['phoneNumber'], 'landlineNumber': oldPmDetails['landlineNumber'], 'email': oldPmDetails['email'], 'companyDetails_user_id': userId}).fetchone()[0]

    company_id_FK = db.execute("DELETE FROM jobDetails WHERE id = :jobDetails_id AND title = :jobType AND jobDescription = :jobDescription AND quantity = :quantity AND start_event = :start_event AND end_event = :end_event AND jobPrice = :jobPrice AND jobPriority = :jobPriority AND status = :status AND technician = :technician AND user_id = :jobDetails_user_id AND companyDetails_id IN (SELECT id FROM companyDetails WHERE companyName = :companyName AND address1 = :address1 AND address2 = :address2 AND address3 = :address3 AND city = :city AND zipCode = :zipCode AND contactName = :contactName AND phoneNumber = :phoneNumber AND landlineNumber = :landlineNumber AND email = :email AND user_id = :companyDetails_user_id) RETURNING companyDetails_id", {'jobDetails_id': jobDetails_id_FK, 'jobType': oldPmDetails['jobType'], 'jobDescription': oldPmDetails['jobDescription'], 'quantity': oldPmDetails['jobQuantity'], 'start_event': oldPmDetails['start_event'], 'end_event': oldPmDetails['end_event'], 'jobPrice': oldPmDetails['jobPrice'], 'jobPriority': oldPmDetails['jobPriority'], 'status': oldPmDetails['status'], 'technician': oldPmDetails['technician'], 'jobDetails_user_id': userId, 'companyName': oldPmDetails['companyName'], 'address1': oldPmDetails['address1'], 'address2': oldPmDetails['address2'], 'address3': oldPmDetails['address3'], 'city': oldPmDetails['city'], 'zipCode': oldPmDetails['zipCode'], 'contactName': oldPmDetails['contactName'], 'phoneNumber': oldPmDetails['phoneNumber'], 'landlineNumber': oldPmDetails['landlineNumber'], 'email': oldPmDetails['email'], 'companyDetails_user_id': userId}).fetchone()[0]

    company_id = db.execute("DELETE FROM companyDetails WHERE id = :companyDetails_id AND companyName = :companyName AND address1 = :address1 AND address2 = :address2 AND address3 = :address3 AND city = :city AND zipCode = :zipCode AND contactName = :contactName AND phoneNumber = :phoneNumber AND landlineNumber = :landlineNumber AND email = :email AND user_id = :companyDetails_user_id RETURNING id", {'companyDetails_id': company_id_FK, 'companyName': oldPmDetails['companyName'], 'address1': oldPmDetails['address1'], 'address2': oldPmDetails['address2'], 'address3': oldPmDetails['address3'], 'city': oldPmDetails['city'], 'zipCode': oldPmDetails['zipCode'], 'contactName': oldPmDetails['contactName'], 'phoneNumber': oldPmDetails['phoneNumber'], 'landlineNumber': oldPmDetails['landlineNumber'], 'email': oldPmDetails['email'], 'companyDetails_user_id': userId}).fetchone()[0]

    db.execute("COMMIT TRANSACTION")

    db.commit()

    return company_id


# Update PM in database
def updatePm(pmDetailsChanges, oldPmDetails, userId):

    # Update data from database with one transaction
    db.execute("BEGIN TRANSACTION")

    jobDetails_id_FK = db.execute("UPDATE joblabor SET labourHours = :labourHours, labourRate = :labourRate, labourTotalPrice = :labourTotalPrice WHERE user_id = :joblabor_user_id AND jobDetails_id IN (SELECT id FROM jobDetails WHERE title = :jobType AND jobDescription = :jobDescription AND start_event = :start_event AND end_event = :end_event AND jobPrice = :jobPrice AND jobPriority = :jobPriority AND status = :status AND technician = :technician AND user_id = :jobDetails_user_id AND companyDetails_id IN (SELECT id FROM companyDetails WHERE companyName = :companyName AND address1 = :address1 AND address2 = :address2 AND address3 = :address3 AND city = :city AND zipCode = :zipCode AND contactName = :contactName AND phoneNumber = :phoneNumber AND landlineNumber = :landlineNumber AND email = :email AND user_id = :companyDetails_user_id)) RETURNING jobDetails_id", {'labourHours': pmDetailsChanges['labourHours'], 'labourRate': pmDetailsChanges['labourRate'], 'labourTotalPrice': pmDetailsChanges['labourTotalPrice'], 'joblabor_user_id': userId, 'jobType': oldPmDetails['jobType'], 'jobDescription': oldPmDetails['jobDescription'], 'start_event': oldPmDetails['start_event'], 'end_event': oldPmDetails['end_event'], 'jobPrice': oldPmDetails['jobPrice'], 'jobPriority': oldPmDetails['jobPriority'], 'status': oldPmDetails['status'], 'technician': oldPmDetails['technician'], 'jobDetails_user_id': userId, 'companyName': oldPmDetails['companyName'], 'address1': oldPmDetails['address1'], 'address2': oldPmDetails['address2'], 'address3': oldPmDetails['address3'], 'city': oldPmDetails['city'], 'zipCode': oldPmDetails['zipCode'], 'contactName': oldPmDetails['contactName'], 'phoneNumber': oldPmDetails['phoneNumber'], 'landlineNumber': oldPmDetails['landlineNumber'], 'email': oldPmDetails['email'], 'companyDetails_user_id': userId}).fetchone()[0]

    company_id_FK = db.execute("UPDATE jobDetails SET title = :jobType, jobDescription = :jobDescription, start_event = :start_event, end_event = :end_event, jobPrice = :jobPrice, jobPriority = :jobPriority, status = :status, technician = :technician WHERE id = :jobDetails_id AND user_id = :jobDetails_user_id AND companyDetails_id IN (SELECT id FROM companyDetails WHERE companyName = :companyName AND address1 = :address1 AND address2 = :address2 AND address3 = :address3 AND city = :city AND zipCode = :zipCode AND contactName = :contactName AND phoneNumber = :phoneNumber AND landlineNumber = :landlineNumber AND email = :email AND user_id = :companyDetails_user_id) RETURNING companyDetails_id", {'jobType': pmDetailsChanges['jobType'], 'jobDescription': pmDetailsChanges['jobDescription'], 'start_event': pmDetailsChanges['start_event'], 'end_event': pmDetailsChanges['end_event'], 'jobPrice': pmDetailsChanges['jobPrice'], 'jobPriority': pmDetailsChanges['jobPriority'], 'status': pmDetailsChanges['status'], 'technician': pmDetailsChanges['technician'], 'jobDetails_id': jobDetails_id_FK, 'jobDetails_user_id': userId, 'companyName': oldPmDetails['companyName'], 'address1': oldPmDetails['address1'], 'address2': oldPmDetails['address2'], 'address3': oldPmDetails['address3'], 'city': oldPmDetails['city'], 'zipCode': oldPmDetails['zipCode'], 'contactName': oldPmDetails['contactName'], 'phoneNumber': oldPmDetails['phoneNumber'], 'landlineNumber': oldPmDetails['landlineNumber'], 'email': oldPmDetails['email'], 'companyDetails_user_id': userId}).fetchone()[0]

    company_id = db.execute("UPDATE companyDetails SET companyName = :companyName, address1 = :address1, address2 = :address2, address3 = :address3, city = :city, zipCode = :zipCode, contactName = :contactName, phoneNumber = :phoneNumber, landlineNumber = :landlineNumber, email = :email WHERE id = :companyDetails_id AND user_id = :companyDetails_user_id RETURNING id", {'companyName': pmDetailsChanges['companyName'], 'address1': pmDetailsChanges['address1'], 'address2': pmDetailsChanges['address2'], 'address3': pmDetailsChanges['address3'], 'city': pmDetailsChanges['city'], 'zipCode': pmDetailsChanges['zipCode'], 'contactName': pmDetailsChanges['contactName'], 'phoneNumber': pmDetailsChanges['phoneNumber'], 'landlineNumber': pmDetailsChanges['landlineNumber'], 'email': pmDetailsChanges['email'], 'companyDetails_id': company_id_FK,  'companyDetails_user_id': userId}).fetchone()[0]

    db.execute("COMMIT TRANSACTION")

    db.commit()

    return company_id


# Get public holiday
def getpublicHoliday(userID):

    # get user country name in order to make an API call for the public holidays
    userCountryName = db.execute("SELECT userCountry FROM usersDetails WHERE user_id = :user_id", {"user_id": userID}).fetchall()

    if not userCountryName:
        return None

    # check if the country name if one of the supported country for the API call
    countryCode = pm_countrylist.apiCountry(userCountryName[0]['usercountry'])

    # if the country is not supported render the PM page
    if not countryCode:
        return None

    # get current year
    year = date.today().year

    # make API call with the current parameters
    getPublicHoliday = helpers.publicholiday(countryCode, year)

    # in case we reach the maximum amount of API calls
    if not getPublicHoliday:
        return None

    return getPublicHoliday
