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


def showUserDetails(userId):
    userDetails = db.execute("SELECT username, to_char(register, 'YYYY-MM-DD HH24:MI:SS') register, userCompanyName, userAddress1, userAddress2, userAddress3, userCity, userCountry, userZipCode, userCompanyRegistrationNumber, userCompanyVatRate, userPhoneNumber, userLandlineNumber, userEmail, userContactName FROM users INNER JOIN usersDetails ON users.id = usersDetails.user_id WHERE users.id = :id AND usersDetails.user_id = :user_id", {'id': userId, 'user_id': userId}).fetchall()

    userDetails = convertTupleSQLtoDict(userDetails)

    return userDetails


def checkChangesInUserDetails(formData, requestForm):
    # make a dict to get the user old data
    oldUserDetails = {'userCompanyName': None, 'userAddress1': None, 'userAddress2': None, 'userAddress3': None, 'userCompanyRegistrationNumber': None, 'userCompanyVatRate': None, 'userPhoneNumber': None, 'userLandlineNumber': None, 'userEmail': None, 'userContactName': None, 'userCity': None, 'userCountry': None, 'userZipCode': None}

    oldUserDetails['userCompanyName'] = requestForm.get('oldData-userCompanyName').strip()
    oldUserDetails['userAddress1'] = requestForm.get('oldData-userAddress1').strip()
    oldUserDetails['userAddress2'] = requestForm.get('oldData-userAddress2').strip()
    oldUserDetails['userAddress3'] = requestForm.get('oldData-userAddress3').strip()
    oldUserDetails['userCompanyRegistrationNumber'] = requestForm.get('oldData-userCompanyRegistrationNumber').strip()
    oldUserDetails['userCompanyVatRate'] = requestForm.get('oldData-userCompanyVatRate').strip()
    oldUserDetails['userPhoneNumber'] = requestForm.get('oldData-userPhoneNumber').strip()
    oldUserDetails['userLandlineNumber'] = requestForm.get('oldData-userLandlineNumber').strip()
    oldUserDetails['userEmail'] = requestForm.get('oldData-userEmail').strip()
    oldUserDetails['userContactName'] = requestForm.get('oldData-userContactName').strip()
    oldUserDetails['userCity'] = requestForm.get('oldData-userCity').strip()
    oldUserDetails['userCountry'] = requestForm.get('oldData-userCountry').strip()
    oldUserDetails['userZipCode'] = requestForm.get('oldData-userZipCode').strip()

    # make a dict to get all user updated data
    userDetails = {'userCompanyName': None, 'userAddress1': None, 'userAddress2': None, 'userAddress3': None, 'userCompanyRegistrationNumber': None, 'userCompanyVatRate': None, 'userPhoneNumber': None, 'userLandlineNumber': None, 'userEmail': None, 'userContactName': None, 'userCity': None, 'userCountry': None, 'userZipCode': None}

    for key, value in formData:
        userDetails[key] = value.strip()

    # check if any changes was made to the user details by checking if oldUserDetails is a subset on userDetails
    # if all key, value pairs from oldUserDetails are in userDetails, the user hasn't made any update to PM
    # and return none
    if oldUserDetails.items() <= userDetails.items():
        return None

    # if changes was submited return the userDetails dict
    return userDetails


def updateUserDetails(userDetailsChanges, userId):

    updateUserDetails = db.execute("UPDATE usersDetails SET userCompanyName = :userCompanyName, userAddress1 = :userAddress1, userAddress2 = :userAddress2, userAddress3 = :userAddress3, userCompanyRegistrationNumber = :userCompanyRegistrationNumber, userCompanyVatRate = :userCompanyVatRate, userPhoneNumber = :userPhoneNumber, userLandlineNumber = :userLandlineNumber, userEmail = :userEmail, userContactName = :userContactName, userCity = :userCity, userCountry = :userCountry, userZipCode = :userZipCode WHERE user_id = :user_id RETURNING id", {'userCompanyName': userDetailsChanges['userCompanyName'], 'userAddress1': userDetailsChanges['userAddress1'], 'userAddress2': userDetailsChanges['userAddress2'], 'userAddress3': userDetailsChanges['userAddress3'], 'userCompanyRegistrationNumber': userDetailsChanges['userCompanyRegistrationNumber'], 'userCompanyVatRate': userDetailsChanges['userCompanyVatRate'], 'userPhoneNumber': userDetailsChanges['userPhoneNumber'], 'userLandlineNumber': userDetailsChanges['userLandlineNumber'], 'userEmail': userDetailsChanges['userEmail'], 'userContactName': userDetailsChanges['userContactName'],  'userCity': userDetailsChanges['userCity'], 'userCountry': userDetailsChanges['userCountry'], 'userZipCode': userDetailsChanges['userZipCode'], 'user_id': userId}).fetchone()[0]

    db.commit()

    if not updateUserDetails:
        return None

    return updateUserDetails
