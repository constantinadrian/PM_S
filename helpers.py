import os
import requests
import urllib.parse
import calendarific

from flask import redirect, render_template, request, session
from functools import wraps
from dotenv import load_dotenv, find_dotenv


def apology(message, code=400):
    """Render message as an apology to user."""
    def escape(s):
        """
        Escape special characters.

        https://github.com/jacebrowning/memegen#special-characters
        """
        for old, new in [("-", "--"), (" ", "-"), ("_", "__"), ("?", "~q"),
                         ("%", "~p"), ("#", "~h"), ("/", "~s"), ("\"", "''")]:
            s = s.replace(old, new)
        return s
    return render_template("apology.html", top=code, bottom=escape(message)), code


def login_required(f):
    """
    Decorate routes to require login.

    http://flask.pocoo.org/docs/1.0/patterns/viewdecorators/
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function


# Contact API calendarific for public holiday
# https://calendarific.com/
def publicholiday(countryCode, year):

    load_dotenv(find_dotenv())

    calapi = calendarific.v2(os.environ.get("CALENDARIFIC_API"))

    parameters = {
        # Required
        'country': countryCode,
        'year':    year,
        'type': 'national',
    }

    holidays = calapi.holidays(parameters)

    checkResponseCode = holidays['meta']['code']
    # if request is successfully return holidays
    if checkResponseCode == 200:
        return holidays

    return None
