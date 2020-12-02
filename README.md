<h1 align="center">PM Schedule</h1>

This project was created for Harvard University: CS50 – Introduction in Computer Science on edX. The project made is a small web application to keep tracks of preventive maintenance jobs. The purpose of this project was to build a web application targeting professional maintenance to reduce the likelihood of equipment breakdowns.

## Live Demo
The project has not been deployed yet on any online platform.

## Table of Contents: 
- #### Features:
  Responsive on all device sizes.
  
  - ##### Existing Features:
  
  1. **Header Logo** - on every page act as a navigation link. There are two functionalities on the logo: 

	    a. When user is not login the logo header is gone bring the user back to landing page.
    
      b. When user is login the logo header is gone bring the user to schedule page.
    
  2. **Landing Page**

      a. The first thing that user encounter is navigation bar with company logo on desktop/laptop and a hamburger menu on mobile devices.

      b. Users are greeted with a hero image and a message, follow by a register button.

      c. User can find the necessary information about the business and what the app does. Here they will find also testimonials from current clients and a contact form for additional information for their questions.
      
  3. **Log in and register**
  
      Are the pages that allow users to sign in or sign up.

  4. **Pricing**

      Will direct the user on price section from landing page to see all available plans for the app.

  5. **Schedule**

	    Will show the user all PM in a calendar. Where each PM it’s open into a modal.
    
  6. **Create pm**

	    In this page the user can create an PM by using the form on the page. Here the user is allowed to select the start of the PM and the finish. By default, the business days are Monday to Friday, from 09:00 to 17:00, which means that the user can’t select weekend as start, or end job, and because we use public holiday API if the public holiday is on weekday that day is also unavailable.
      In this form there is also a field that will calculate automatic how many working hours are between does two dates.

  7. **Pm**

	    On this page the user can view all the PM that he has. The Pm that have the status “Open” can be edited or delete depending on user. 
      
  8. **Records**
  
      On this page the user can see all the completed PM each with their invoice.

  9. **Report**

	    On report page the user can view on month report (which is showing all PM’s for that specific month) and the year report which is showing the total of each invoices per month.
    
  10.	**Account**

	    On this page the user can choose to either update their details or to change passwords.
 
  - ##### Future Features to Implement:
  
  1. Flask security which adds basic security and authentication features to web app quickly and easily (e.g. Token based account activation. Token based password recovery / resetting).

  2. Form Validation with WTForms. 

  3. Implement send email with contact form.

  4. reCAPTCHA support for contact form and reset password.

  5. Making the calendar event showing more specific information and make inside a link to open on different window the customer address in google map with API to calculate the travel money.

  6. When create PM add more sub forms for parts and inventory. Also, to be able to add multiple jobs at once to same company with different dates and time and have one final invoice for the company, if the company requires more jobs at beginning. 

  7. Making reports details to show each asset lifetime and the occurring pm.

  8. Make financial report with profit from each job and show how much labour cost is plus other costs like parts, travel.

- #### Typography:
      
    I have use Google fonts because typography is the most important aspect of UX design. 
      
    Using Google Fonts on the web app can make the it look more appealing. That’s way I have choice the Roboto and Playfair Display fonts.
    
- #### Technologies Used:

   HTML5 - for the structure the content of the web app

   CSS3 – for making the elements of the page responsive, but also to style the elements on the page: fonts, color, spacing.

   JavaScript – for manipulate the DOM

   jQuery Validation Plugin – used for validate the forms on client-side register, create PM and edit PM.

   Bootstrap – CSS framework used to help with the navbar, modal, forms, carousel, card and few icons.

   Font Awesome – most of the icons are from Font Awesome website.

   Google Fonts - to import the font-family

   Pyhton3 – to add functionalities to the server-side. 

   Psycopg – PostgreSQL database adapter for the Python programming language.

   Flask – Python micro web framework

   Jinja2 – Python template engine 

   PostgreSQL – to store information into database

   DataTable – a powerful jQuery plugin for creating table listings and adding interactions to them. It provides searching, sorting and pagination without any configuration.  I used to display all information into

   Fullcalendar – Full-sized event calendar in JavaScript used to display each PM into calendar and open event into a modal

   Datetimepicker – jQuery plugin selects date and time, which allow user to select the dates when each PM starts and finish.

   MomentJS - for parsing, validating and displaying date/time

   pdfMake – is a client/server-side PDF printing in pure JavaScript which I used to create/generate invoices for each PM.

   Chart.js – for data visualization. 
 
- #### API 

  Calendarific.com – used to get the public holiday for each country. Used this to disable, highlight and show name of the public holidays in Datetimepicker plugin.
  
- #### Tools:

  CS50: IDE – for the first part of project and had to migrate the code to localhost because I didn’t have enough space on my account, even after I deleted some of my previous pset, I had to move all the files which was a good experience because I have installed PostgreSQL on PC and learn how to work in virtual environment and set variable in system environment and after in .env file

  VS Code: IDE – for the rest of the project.
  
- #### Additional tools used:

1. Autoprefixer
2. Adobe Photoshop 2020: where I have modified a bootstrap icon for making it a logo (favicon.ico). 

- #### Validation: 

  [HTML Validator](https://validator.w3.org/)
  
  [CSS Validator](https://jigsaw.w3.org/css-validator/)
  
  [JavaScript](https://jshint.com/)
  
  [PEP8 Validator](http://pep8online.com/)

- #### Run tests:

  - ##### Register for new account
  
    PostgreSQL 11 was reflecting user account information after registration

  - ##### Register for new account with same username
  
    Error raised “This user is already taken.”
    
  - ##### Register for new account with different user but with the same Company Name as another user
  
    Error raised “This Company Name was already used for registration.

  - ##### Register for new account with different user, different Company Name but with the same email as another user
  
    Error raised “The email address is already in use.”
    
  - ##### Tested functionality of login:
  
  1. If the user in not found in database:
  
      Error raised “Invalid username and/or password”
    
  2. If the user is found but the password doesn’t much:
  
      Error raised “Invalid username and/or password”

  - ##### Tested for create PM
  
  The database is reflecting the information after creating pm.

  - ##### Tested for edit pm 
  
  1. If the user decides to edit the information but he submits the same information all over again, we are not submitting anything to database because nothing was change. A message is display as a warning message:

      “You haven’t submitted any changes to your pm”, 

  2. If the user makes any changes to the PM the database is showing that change and we show user a message:
  
      “Your PM was successfully updated!”

  3. If the user deletes the PM the database is showing that change and a message is show to the user.

      “Your PM was successfully deleted!”

  - ##### Tested to see if each invoice is showing for the right PM
  
  - ##### Tested if each link from navigation bar leads to the correct page 
  
  - ##### Tested that all hover effects work correctly
  
  - ##### Tested the responsiveness for all devices on Chrome DevTools.
  
      Also used extension [Resolution Test](https://chrome.google.com/webstore/detail/resolution-test/idhfcdbheobinplaamokffboaccidbal) and [Window Resizer](https://chrome.google.com/webstore/detail/window-resizer/kkelicaakdanhinjdeammmilcgefonfh/related) in conjunction with Chrome Dev Tools to test varying screen sizes/resolutions

  - ##### Tested on: Google Chrome, Internet Explorer, Microsoft Edge and Mozilla Firefox to view the web app in different browsers.
  
- #### Deployment: 

  - ##### Local Deployment:
  
  I.	Create an environment
  
  1.	Create a project folder Create a project folder
  
      $ mkdir pmproject
  
      $ cd pmproject
  
  2.	Create a virtual environment within project directory
  
      $ python3 -m venv venv

      On Windows:

      $ py -3 -m venv venv
      
  3.	Activate the environment Activate the environment
  
      Before you work on your project, activate the corresponding environment:

      $ . venv/bin/activate

      On Windows:

      > venv\Scripts\activate 

      Your shell prompt will change to show the name of the activated environment.

  II.	Install Flask
  
  1.	Within the activated environment, use the following command to install Flask:
  
      $ pip install Flask

  2.	Now install all dependencies from requirements.txt: 

      pip3 install -r requirements.txt 
	
  3.	Create the DB in PostgreSQL 

    Download PostgreSQL from [here](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
      
  4.	Get a free API Key for public holiday at [Calendarific](https://calendarific.com/)
  
  5.	Now you can create an .env file and set up the variable:
  
      SECRET_KEY=secret_key

      CALENDARIFIC_API=your_api_key

      DATABASE_URL=postgresql://user:password@hostname:port/databaseName

    *Note: on python 3, for using calendarific API for public holiday (if register) you need to do the following*:
    
      a. inside your folder pmproject go to:
       
       env\Lib\site-packages\calendarific\__init__.py

      b. wants you open __init__.py you need to change the following:
      
      On line 13 change:
      
      if parameters.has_key('api_key') is False:

      with 

      if 'api_key' not in parameters:

      And now on line 20 change:

      if data.has_key('error') is False:

      with

      if 'error' not in data:
 
    That is because from Python 3.x, has_key() was removed, see the [documentation](https://docs.python.org/3.1/whatsnew/3.0.html#builtins) 
      
    More info at [Calendarific Github](https://github.com/calendarific/python-calendarific/issues/3) 
          
  6.	After you made the change use the following command to start the application

      flask run 
      
  7.	You can now access the web app at http://127.0.0.1:5000/    

  For more information about installation see the [documentation](https://flask.palletsprojects.com/en/1.1.x/installation/)

- #### Credits:

1.	[CS50X](https://www.edx.org/course/cs50s-introduction-to-computer-science)  
2.	https://github.com/cs50/python-cs50/blob/develop/src/cs50/sql.py 
3.	The first background image on landing page is from [unsplash](https://unsplash.com/) photo by [Science in HD](https://unsplash.com/photos/i4ABHj811N0)
4.	Second and third background image on landing page are from [pexels](https://www.pexels.com/) photo by [Kateryna Babaieva](https://www.pexels.com/@kateryna-babaieva-1423213) 
5.	Fourth background image on landing page (testimonial and contact section) and on apology page is from [pexels](https://www.pexels.com/) photo by [Digital Buggu](https://www.pexels.com/photo/colorful-toothed-wheels-171198/) 
6.	Testimonials photo from [pexels](https://www.pexels.com/):
[Photo1](https://www.pexels.com/photo/businessmen-having-a-meeting-at-a-cafe-4427908/) by August de Richelieu, 
[Photo2](https://www.pexels.com/photo/man-wearing-white-dress-shirt-and-black-necktie-716411/) and [Photo3](https://www.pexels.com/photo/man-sitting-on-chair-beside-table-834863/)  by Andrea Piacquadio 
7.	The four icons on profile page on buttons from [icons8](https://icons8.com) 
8.	Fullcalendar.io – [GitHub Repository](https://github.com/fullcalendar/fullcalendar) or [Official Site](https://fullcalendar.io/) for documentation 
9.	DataTable - [GitHub Repository](https://github.com/DataTables/DataTables) or [Official Site](https://datatables.net/) for documentation 
10.	DateTimePicker – [GitHub Repository](https://github.com/xdan/datetimepicker) or [Official Site](https://xdsoft.net/jqplugins/datetimepicker/) for documentation 
11.	https://stackoverflow.com/questions/24723537/restrict-user-from-changing-input-fields-date-unless-when-using-datepicker 
12.	Chart JS - [GitHub Repository](https://github.com/chartjs) or [Official Site](https://www.chartjs.org/) for documentation 
13.	 pdfMake – [GitHub Repository](https://github.com/bpampuch/pdfmake) or [Official Site](https://pdfmake.github.io/docs/0.1/) 
14.	 jQuery Validation Plugin – [GitHub Repository](https://github.com/jquery-validation/jquery-validation) or [Official Site](https://jqueryvalidation.org/) 
15.	https://stackoverflow.com/questions/11360925/how-to-clear-jquery-validate-errors#14831537 
16.	API public holiday - [Calendarif](https://calendarific.com/) 
17.	https://www.w3schools.com/howto/howto_js_scroll_to_top.asp
18.	https://stackoverflow.com/questions/41908295/fullcalendar-change-view-for-mobile-devices 
19.	https://stackoverflow.com/questions/6291225/convert-date-from-thu-jun-09-2011-000000-gmt0530-india-standard-time-to 
20.	https://www.youtube.com/watch?v=wA-Iy6ThYz4  
21.	https://snipplr.com/view/4086/calculate-business-days-between-two-dates 
22.	https://thecodedeveloper.com/disable-past-date-time/ 
23.	https://getbootstrap.com/docs/4.5/components/tooltips/  
24.	https://stackoverflow.com/questions/5113374/javascript-check-if-variable-exists-is-defined-initialized/36432729#36432729 
25.	https://stackoverflow.com/questions/28198883/auto-increament-the-invoice-number-in-django-backend-for-new-invoice 
26.	https://getbootstrap.com/docs/4.5/components/modal/ 
27.	https://getbootstrap.com/docs/4.5/components/forms/ 
28.	https://getbootstrap.com/docs/4.5/components/carousel/ 
29.	https://getbootstrap.com/docs/4.5/components/card/ 
30.	https://getbootstrap.com/docs/4.5/components/navbar/ 
31.	https://developer.mozilla.org/en-US/- resource
32.	https://jquery.com/ - resource
33.	https://www.wikidot.com/ - inspired for landing page
34.	Code – Institute – the 3 question on landing page was inspired from the: [5 Day Coding Challenge](https://codeinstitute.net/5-day-coding-challenge/)

- #### Acknowledgements:

  1. I would like to give a big thank you to Prof. David J. Malan, Doug Lloyd, Brian Yu, Zamyla Chan and the whole CS50's staff behind the scenes at Harvard University for this amazing course. 
  
      Thank you for this great journey. 
  
      This was [CS50x!](https://cs50.harvard.edu/x/2020/) 


  2. *For Readme*: 
  
      https://github.com/microverseinc/readme-template 
  
      https://medium.com/@meakaakka/a-beginners-guide-to-writing-a-kickass-readme-7ac01da88ab3 
  
- #### Anti-Plagiarism: 

  As far as I know, I have credited all media and code sources that are not mine. Anything missed is absolutely a mistake on my part and it is unintentional and by no means am I trying to be a villain. 

- #### Disclaimer

  **This project is for educational purposes only.**
























