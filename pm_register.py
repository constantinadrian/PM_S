import os
import calendar

from flask import request, session
from flask_session import Session

from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from datetime import datetime, date, timedelta
from sql import convertTupleSQLtoDict

# Create engine object to connect to database
engine = create_engine(os.getenv("DATABASE_URL"))

# Use scoped session to separate user interactions with database
# https://docs.sqlalchemy.org/en/13/orm/contextual.html
db = scoped_session(sessionmaker(bind=engine))


def registerUser(formData):

    registerNewUser = {'username': None, 'password': None, 'registerDateTime': None, 'userCompanyName': None, 'userAddress1': None, 'userAddress2': None, 'userAddress3': None, 'userCompanyRegistrationNumber': None, 'userCompanyVatRate': None, 'userPhoneNumber': None, 'userLandlineNumber': None, 'userEmail': None, 'userContactName': None, 'userCity': None, 'userCountry': None, 'userZipCode': None}

    for key, value in formData:
        if key == 'username':
            # store username in lower case in database
            registerNewUser[key] = (value.strip()).lower()
        elif key == 'password':
            # Hash the password
            registerNewUser[key] = generate_password_hash(value.strip())
        else:
            registerNewUser[key] = value.strip()

    registerNewUser['registerDateTime'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # INSERT new user INTO database
    db.execute("BEGIN TRANSACTION")

    user_id = db.execute("INSERT INTO users (username, hash, register) VALUES (:username, :hashPassword, current_timestamp) RETURNING id", {"username": registerNewUser['username'], "hashPassword": registerNewUser['password']}).fetchone()[0]

    userDetails_id = db.execute("INSERT INTO usersDetails (userCompanyName, userAddress1, userAddress2, userAddress3, userCity, userCountry, userZipCode, userCompanyRegistrationNumber, userCompanyVatRate, userPhoneNumber, userLandlineNumber, userEmail, userContactName, user_id) VALUES (:userCompanyName, :userAddress1, :userAddress2, :userAddress3, :userCity, :userCountry, :userZipCode, :userCompanyRegistrationNumber, :userCompanyVatRate, :userPhoneNumber, :userLandlineNumber, :userEmail, :userContactName, :user_id) RETURNING id", {'userCompanyName': registerNewUser['userCompanyName'], 'userAddress1': registerNewUser['userAddress1'], 'userAddress2': registerNewUser['userAddress2'], 'userAddress3': registerNewUser['userAddress3'], 'userCity': registerNewUser['userCity'], 'userCountry': registerNewUser['userCountry'], 'userZipCode': registerNewUser['userZipCode'], 'userCompanyRegistrationNumber': registerNewUser['userCompanyRegistrationNumber'], 'userCompanyVatRate': registerNewUser['userCompanyVatRate'], 'userPhoneNumber': registerNewUser['userPhoneNumber'], 'userLandlineNumber': registerNewUser['userLandlineNumber'], 'userEmail': registerNewUser['userEmail'], 'userContactName': registerNewUser['userContactName'], 'user_id': user_id}).fetchone()[0]

    db.execute("COMMIT TRANSACTION")

    # Save (commit) the changes
    db.commit()

    if not user_id:
        return None

    return user_id
