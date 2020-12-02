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


def curentMonthPm(userId):

    report = db.execute("SELECT COUNT(jobpriority) FILTER (WHERE date_trunc('month', start_event)::date = date_trunc('month', CURRENT_DATE)::date AND status = 'Open' AND jobPriority = 'Low Priority') AS lowpriority, COUNT(jobpriority) FILTER (WHERE date_trunc('month', start_event)::date = date_trunc('month', CURRENT_DATE)::date AND status = 'Open' AND jobPriority = 'Medium Priority' ) AS mediumpriority, COUNT(jobpriority) FILTER (WHERE date_trunc('month', start_event)::date = date_trunc('month', CURRENT_DATE)::date AND status = 'Open' AND jobPriority = 'Critical Priority' ) AS criticalpriority, COUNT(status) FILTER (WHERE date_trunc('month', start_event)::date = date_trunc('month', CURRENT_DATE)::date AND status = 'Complete' ) AS complete FROM jobDetails WHERE user_id = :user_id", {'user_id': userId}).fetchall()

    report = convertTupleSQLtoDict(report)

    return report


def pmWorkOrdersCompleted(userId):

    pmWorkOrders = db.execute("SELECT SUM(totalprice) FILTER (WHERE EXTRACT(MONTH FROM dateofissue) = '1' AND  date_trunc('year', dateofissue) = date_trunc('year', CURRENT_DATE) ) AS january, SUM(totalprice) FILTER (WHERE EXTRACT(MONTH FROM dateofissue) = '2' AND  date_trunc('year', dateofissue) = date_trunc('year', CURRENT_DATE) ) AS february, SUM(totalprice) FILTER (WHERE EXTRACT(MONTH FROM dateofissue) = '3' AND  date_trunc('year', dateofissue) = date_trunc('year', CURRENT_DATE) ) AS march, SUM(totalprice) FILTER (WHERE EXTRACT(MONTH FROM dateofissue) = '4' AND  date_trunc('year', dateofissue) = date_trunc('year', CURRENT_DATE) ) AS april, SUM(totalprice) FILTER (WHERE EXTRACT(MONTH FROM dateofissue) = '5' AND  date_trunc('year', dateofissue) = date_trunc('year', CURRENT_DATE) ) AS may, SUM(totalprice) FILTER (WHERE EXTRACT(MONTH FROM dateofissue) = '6' AND  date_trunc('year', dateofissue) = date_trunc('year', CURRENT_DATE) ) AS june, SUM(totalprice) FILTER (WHERE EXTRACT(MONTH FROM dateofissue) = '7' AND  date_trunc('year', dateofissue) = date_trunc('year', CURRENT_DATE) ) AS july, SUM(totalprice) FILTER (WHERE EXTRACT(MONTH FROM dateofissue) = '8' AND  date_trunc('year', dateofissue) = date_trunc('year', CURRENT_DATE) ) AS august, SUM(totalprice) FILTER (WHERE EXTRACT(MONTH FROM dateofissue) = '9' AND  date_trunc('year', dateofissue) = date_trunc('year', CURRENT_DATE) ) AS september, SUM(totalprice) FILTER (WHERE EXTRACT(MONTH FROM dateofissue) = '10' AND  date_trunc('year', dateofissue) = date_trunc('year', CURRENT_DATE) ) AS octomber, SUM(totalprice) FILTER (WHERE EXTRACT(MONTH FROM dateofissue) = '11' AND  date_trunc('year', dateofissue) = date_trunc('year', CURRENT_DATE) ) AS november, SUM(totalprice) FILTER (WHERE EXTRACT(MONTH FROM dateofissue) = '12' AND  date_trunc('year', dateofissue) = date_trunc('year', CURRENT_DATE) ) AS december FROM invoice WHERE user_id = :user_id", {'user_id': userId}).fetchall()

    pmWorkOrders = convertTupleSQLtoDict(pmWorkOrders)

    return pmWorkOrders
