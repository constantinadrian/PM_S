import os
from datetime import date

from tempfile import mkdtemp
from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_session import Session

from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from dotenv import load_dotenv, find_dotenv

from helpers import apology, login_required, publicholiday
from sql import convertTupleSQLtoDict
import pm_scheduler
import pm_records
import pm_report
import pm_register
import pm_invoice
import pm_countrylist
import pm_profile

# Configure application
app = Flask(__name__)

# Find the .env file
load_dotenv(find_dotenv())

# Set app key
app.secret_key = os.getenv("SECRET_KEY")

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True


# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Create engine object to connect to database
engine = create_engine(os.getenv("DATABASE_URL"))

# Use scoped session, for thread safety, to separate user interactions with database
# https://docs.sqlalchemy.org/en/13/orm/contextual.html
db = scoped_session(sessionmaker(bind=engine))


@app.route('/', methods=["GET", "POST"])
def main():
    """Show user index page"""

    # User reached route via GET
    if request.method == "GET":
        return render_template('index.html')

    # User reached route via POST
    else:
        return render_template("register.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""

    # User reached route via GET
    if request.method == "GET":
        return render_template("register.html")

    # User reached route via POST
    else:
        # Check user name input
        username = request.form.get("username").strip()

        # If no username provided return apology
        if not username:
            return apology("You must provide a name.")

        # Check if username is already taken
        else:
            rows = db.execute("SELECT username FROM users")
            for row in rows:
                if row["username"] == username:
                    return apology("This username is already taken.")

        # Check if confirmation user matches user
        usernameConfirmation = request.form.get("usernameConfirmation").strip()
        if not username == usernameConfirmation:
            return apology("Username Confirmation must be the same.")

        # Check user password input
        password = request.form.get("password").strip()
        if not password:
            return apology("You must provide a password.")

        # Check if confirmation password matches password
        passwordConfirmation = request.form.get("passwordConfirmation").strip()
        if not password == passwordConfirmation:
            return apology("Password must be the same.")

        # Check user Company Name input
        user_company_name = request.form.get("userCompanyName").strip().lower()

        # Check if another user already register the Company Name
        users_company = db.execute("SELECT usercompanyName FROM usersDetails")
        for row in users_company:
            if row["usercompanyname"].lower() == user_company_name:
                return apology("This Company Name was already used for registration.")

        # Check user email input
        user_email = request.form.get("userEmail").strip().lower()

        # Check if another user already register the same email
        users_email = db.execute("SELECT useremail FROM usersDetails")
        for row in users_email:
            if row["useremail"].lower() == user_email:
                return apology("The email address is already in use.")

        # Make a list with all data from request form
        formData = list(request.form.items())

        # Register the user in database
        user_id = pm_register.registerUser(formData)
        if not user_id:
            return apology("Oops! Something went wrong and we couldn't register you details. Try again!")

        # Remember which user has logged in
        session["user_id"] = user_id

        # Flash message if successfully register
        flash('You were successfully register', category='alert-primary')

        # Redirect user to home page
        return redirect("/schedule")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("You must provide a username.", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("You must provide a password.", 403)

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = :username", {"username": request.form.get("username").lower()}).fetchall()

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return apology("Invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Flash message if successfully logged in
        flash('You were successfully logged in', category='alert-primary')

        # Redirect user to home page
        return redirect("/schedule")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout", methods=["GET", "POST"])
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/schedule", methods=["GET", "POST"])
@login_required
def index():
    """Show PM schedule of day/week/month"""
    # User reached route via GET or via redirect
    if request.method == "GET":
        rows = db.execute("SELECT * FROM jobdetails WHERE user_id = :user_id", {"user_id": session["user_id"]}).fetchall()

        if rows:
            rows = convertTupleSQLtoDict(rows)

        return render_template("schedule.html", rows=rows)


@app.route("/pm", methods=["GET", "POST"])
@login_required
def pm():
    """Show PM status"""
    if request.method == "GET":
        # query for pm in database
        pm_datatable = pm_scheduler.getAllPm(session["user_id"])

        # get the public holiday for user registration country if country is supported in the API call
        getPublicHoliday = pm_scheduler.getpublicHoliday(session["user_id"])

        if not getPublicHoliday:
            holidayList = []
            return render_template("pm.html", pm_datatable=pm_datatable, getPublicHoliday=holidayList)

        return render_template("pm.html", pm_datatable=pm_datatable, getPublicHoliday=getPublicHoliday)
    else:
        # check if pm exist in database
        oldPmDetails = pm_scheduler.pmExist(request.form, session["user_id"])

        if not oldPmDetails:
            return apology('Oops! We couldn\'t process your request because the PM doesn\'t exist')

        if request.form.get('btnDeleteConfirm') == 'Confirm Delete':
            # delete the pm that user has selected
            userDeletePm = pm_scheduler.deletePm(oldPmDetails, session["user_id"])

            if userDeletePm:
                # query for pm in database
                pm_datatable = pm_scheduler.getAllPm(session["user_id"])

                # get the public holiday for user registration country if country is supported in the API call
                getPublicHoliday = pm_scheduler.getpublicHoliday(session["user_id"])

                if not getPublicHoliday:
                    holidayList = []
                    return render_template("pm.html", pm_datatable=pm_datatable, getPublicHoliday=holidayList)

                # Flash message if successfully deleted PM
                flash('Your PM was successfully deleted!', category='alert-danger')

                return render_template("pm.html", pm_datatable=pm_datatable, getPublicHoliday=getPublicHoliday)
            else:
                return apology("Oops! Something went wrong and we couldn't delete your PM.")

        elif request.form.get('btnSave') == 'Update PM':
            formData = list(request.form.items())
            # check if any changes was made in the PM details
            pmDetailsChanges = pm_scheduler.checkChangesInPm(formData, oldPmDetails)

            # if user has not made any changes return to PM page and display message
            if not pmDetailsChanges:
                # query for pm in database
                pm_datatable = pm_scheduler.getAllPm(session["user_id"])

                # get the public holiday for user registration country if country is supported in the API call
                getPublicHoliday = pm_scheduler.getpublicHoliday(session["user_id"])

                if not getPublicHoliday:
                    holidayList = []
                    return render_template("pm.html", pm_datatable=pm_datatable, getPublicHoliday=holidayList)

                # Flash message if user hasn't made any changes
                flash('You haven\'t submitted any changes to your PM!', category='alert-warning')

                return render_template("pm.html", pm_datatable=pm_datatable, getPublicHoliday=getPublicHoliday)

            # if there was any changes to the form updated PM details and return the COMPANY_ID if succesufull
            companyId = pm_scheduler.updatePm(pmDetailsChanges, oldPmDetails, session["user_id"])

            # if update was successuful render the page and display success message
            if companyId:
                # check if user has updated the PM status to complete and return the JOBLABOR_ID if succesufull
                jobLababorId = pm_records.checkStatus(companyId, session["user_id"])

                # if status was updated generate invoice for that PM
                if jobLababorId:
                    # create invoice details and return invoice id if succesufull
                    getInvoiceId = pm_records.createInvoice(jobLababorId, pmDetailsChanges, session["user_id"])

                    if not getInvoiceId:
                        return apology("Oops! Something went wrong and we couldn't generate invoice for your PM.")

                    # Get all PM that are complete
                    getCompletePm = pm_records.completePm(session["user_id"])

                    # get user company details for pdf make
                    userCompanyDetails = pm_invoice.userCompanyDetails(session["user_id"])

                    # make a structure from each company to access their own invoice
                    invoices = pm_invoice.companyInvoices(session["user_id"])

                    # Flash message if successfully updated PM
                    flash('Your new invoice was succesfully generated.', category='alert-success')

                    return render_template("records.html", records=getCompletePm, userCompanyDetails=userCompanyDetails, invoices=invoices)

                # query for pm in database
                pm_datatable = pm_scheduler.getAllPm(session["user_id"])

                # Flash message if successfully updated PM
                flash('Your PM was successfully updated!', category='alert-success')

                # get the public holiday for user registration country if country is supported in the API call
                getPublicHoliday = pm_scheduler.getpublicHoliday(session["user_id"])

                if not getPublicHoliday:
                    holidayList = []
                    return render_template("pm.html", pm_datatable=pm_datatable, getPublicHoliday=holidayList)

                return render_template("pm.html", pm_datatable=pm_datatable, getPublicHoliday=getPublicHoliday)

            else:
                return apology("Oops! Something went wrong and we couldn't update your PM.")

        else:
            return apology("Oops! Something went wrong and we couldn't process your request. Try again!")


@app.route("/createpm", methods=["GET", "POST"])
@login_required
def createpm():
    """Show Create PM Form"""
    if request.method == "GET":

        # get the public holiday for user registration country if country is supported in the API call
        getPublicHoliday = pm_scheduler.getpublicHoliday(session["user_id"])

        if not getPublicHoliday:
            holidayList = []
            return render_template("createpm.html", getPublicHoliday=holidayList)

        return render_template("createpm.html", getPublicHoliday=getPublicHoliday)

    # if method is "POST"
    else:
        formData = list(request.form.items())

        # insert new PM in DB
        jobLababor_id = pm_scheduler.insertNewPm(formData, session["user_id"])

        # if succesufull insert PM
        if jobLababor_id:
            # check if user create PM with status complete
            checkStatus = request.form.get('status').strip()

            if not checkStatus == 'Complete':
                # Query database jobDetails table to display all PM on scheduler
                rows = db.execute("SELECT * FROM jobdetails WHERE user_id = :user_id", {"user_id": session["user_id"]}).fetchall()

                # Flash message if successfully created a new PM
                flash('Your PM was successfully created!', category='alert-success')

                # rows = [dict(row) for row in rows]
                rows = convertTupleSQLtoDict(rows)
                return render_template("schedule.html", rows=rows)

            # create a dict for pmDetails
            pmDetails = {'jobPrice': None, 'labourTotalPrice': None}

            pmDetails['jobPrice'] = request.form.get('jobPrice').strip()

            labourHours = request.form.get('labourHours').strip()
            labourRate = request.form.get('labourHours').strip()

            pmDetails['labourTotalPrice'] = float(str(labourHours)) * float(str(labourRate))

            # create invoice details and return invoice id if succesufull
            getInvoice_id = pm_records.createInvoice(jobLababor_id, pmDetails, session["user_id"])

            if not getInvoice_id:
                return apology("Oops! Something went wrong and we couldn't generate invoice for your PM.")

            # Get all PM that are complete
            getCompletePm = pm_records.completePm(session["user_id"])

            # get user company details for pdf make
            userCompanyDetails = pm_invoice.userCompanyDetails(session["user_id"])

            # make a structure from each company to access their own invoice
            invoices = pm_invoice.companyInvoices(session["user_id"])

            # Flash message if successfully updated PM
            flash('Your new invoice was succesfully created.', category='alert-success')

            return render_template("records.html", records=getCompletePm, userCompanyDetails=userCompanyDetails, invoices=invoices)

        else:
            return apology("Oops! Something went wrong and we couldn't create your PM. Try again!")


@app.route("/records", methods=["GET", "POST"])
@login_required
def records():
    """Show PM records"""
    if request.method == "GET":
        # Get all PM that are complete
        getCompletePm = pm_records.completePm(session["user_id"])

        # get user company details for pdf make
        userCompanyDetails = pm_invoice.userCompanyDetails(session["user_id"])

        # make a structure from each company to access their own invoice
        invoices = pm_invoice.companyInvoices(session["user_id"])

        return render_template("records.html", records=getCompletePm, userCompanyDetails=userCompanyDetails, invoices=invoices)


@app.route("/report", methods=["GET", "POST"])
@login_required
def report():
    """Show PM records"""
    if request.method == "GET":

        currentMonthPmReport = pm_report.curentMonthPm(session["user_id"])

        currentYearWorkOrdersCompleted = pm_report.pmWorkOrdersCompleted(session["user_id"])

        return render_template("report.html", currentMonthPmReport=currentMonthPmReport, currentYearWorkOrdersCompleted=currentYearWorkOrdersCompleted)


@app.route("/account", methods=["GET", "POST"])
def account():
    """User account"""
    if request.method == "GET":
        # Show user account page
        return render_template("account.html")


@app.route("/changepassword", methods=["GET", "POST"])
def changepassword():
    """Show user change password form"""
    if request.method == "GET":
        # Show user account page
        return render_template("changepassword.html")
    else:
        # Check user name input
        oldPassword = request.form.get("oldPassword").strip()
        if not oldPassword:
            return apology("You must provide your old password.")

        # check if old password is in the db, before we change the password
        rows = db.execute("SELECT hash FROM users WHERE id = :user_id", {'user_id': session["user_id"]}).fetchall()
        for row in rows:
            if not check_password_hash(row["hash"], oldPassword):
                return apology("Your old password does match with the password from our database")

        # Check new password input
        password = request.form.get("password").strip()
        if not password:
            return apology("Oops! You didn't provide a new password.")

        # Check if confirmation password matches password
        passwordConfirmation = request.form.get("confirmPassword").strip()
        if not password == passwordConfirmation:
            return apology("Oops! The confirmation password is not the same with your new password.")

        # Hash the new user password
        newHashPassword = generate_password_hash(password)

        # Update the new password into DB
        user_id = db.execute("UPDATE users SET hash = :newHashPassword WHERE id = :user_id RETURNING id", {'newHashPassword': newHashPassword, 'user_id': session["user_id"]}).fetchall()

        db.commit()

        if not user_id:
            return apology("Oops! Something went wrong and we couldn't register you details. Try again!")

        # Flash message if successfully register
        flash('You have successfully updated your password', category='alert-primary')

        # Redirect user to home page
        return render_template("account.html")


@app.route("/profile", methods=["GET", "POST"])
def profile():
    """Show user profile"""
    if request.method == "GET":
        # get user details
        userDetails = pm_profile.showUserDetails(session["user_id"])

        return render_template("profile.html", userDetails=userDetails)
    else:
        formData = list(request.form.items())
        # check if any changes was made in the user details
        userDetailsChanges = pm_profile.checkChangesInUserDetails(formData, request.form)

        # if user has not made any changes return to profile page and display message
        if not userDetailsChanges:
            # get user details
            userDetails = pm_profile.showUserDetails(session["user_id"])

            # Flash message if user hasn't made any changes
            flash('You haven\'t submitted any changes to your details!', category='alert-warning')

            return render_template("profile.html", userDetails=userDetails)

        updateUserChanges = pm_profile.updateUserDetails(userDetailsChanges, session["user_id"])

        if not updateUserChanges:
            return apology("Oops! Something went wrong and we couldn't update your profile details.")

        # get user details
        userDetails = pm_profile.showUserDetails(session["user_id"])

        # Flash message if successfully update profile details
        flash('You have successfully updated your profile details', category='alert-primary')

        return render_template("profile.html", userDetails=userDetails)


@app.route("/attribute", methods=["GET", "POST"])
def attribute():
    """User account"""
    if request.method == "GET":
        # Show user site credit page
        return render_template("attribute.html")


# Handle errors
def errorhandler(e):
    """Handle error"""
    if not isinstance(e, HTTPException):
        e = InternalServerError()
    return apology(e.name, e.code)


# Listen for errors
for code in default_exceptions:
    app.errorhandler(code)(errorhandler)


if __name__ == "__main__":
    app.run(debug=True)
