# Savi-Server

### Startup Instructions:
#### Node/NPM
  - Ensure your Node and NPM versions are up to date
    - Recommendations are Node >= 7.8.0 and NPM >= 4.2.0
  - Install global packages:
    - `npm install -g webpack`
    - `npm install -g nodemon`
  - Install app-specific packages:
    - `npm install`

#### Config Variables
  - Fill out your config.js file with the following values:
    - Port - This will be the port that all services run on
    - dbName - The name of the database in which to store the tables
    - uname - The username for mySQL on your server
    - password - The password for the aforementioned username
    - pKeyPath - The path to your private key file
    - certPath - The path to your signed SSL/TLS certification (this MUST be signed)
  - If there is any confusion here, copy/paste the code from config_TEMPLATE.js

#### Database Setup
  - In order to run the app, you must have mySQL running as well as:
    - The correct username/password as above
    - The database named above previously created and empty within your mySQL instance
  - In order to run the automated tests, there must also be:
    - A database called `test` owned by the same username/password

#### Running the app
  - To run the app you will need to build the app as well as start the server
    - `npm run build` will build the application
    - `npm start` will start the server application
    - `npm run live` will do both of these, in order

#### Testing
  - Never push the app without first passing all tests:
    - the command `npm test` will run all automated tests

### Seed File

The sampleData.js file will help will seed the DB or recreate and seed the tables if they already have data in it. Use it then as a starting or reset command.

config/config.js sets up some enviroment variables for the DB in development and production. It is git ignored, hence you should create and populate this file in the server manually. Careful when setting your personal port and the database name that should be created in mysql.

With that done, and the DB created on each environment, you should be able to type:

```> npm run seed```


### API Endpoints
- GET
  - `/api/tours` gets all tours from the DB
  - `/api/tours?cityId=X` gets all tours for the city with ID of X
  - `/api/tours?tourId=X` gets the tour of that particular ID
  - `/api/cities` gets all cities from the DB
  - `/api/cities?cityId=X` gets the city with ID X
  - `/api/images/~imagename~` gets the image of that name
  - `/api/bookings?tourId=X&date=Y&userId=Z` returns a booking with a driver and guide for the given tourID (X) and date (Y), books that for user with the OAuth ID of Z
  - `/api/bookings?userId=Z` returns an array of all bookings for the user with that OAuth ID

- POST
  - `/api/cities` Posts new city to DB
    - Format: {name: 'Name Of City', mainImage: '~VALID IMAGE URL~'}
  - `/api/tours` Posts a new tour to DB
    - Format: {title: 'Name of Tour', description: 'Tour Description', mainImage: '~VALID IMAGE URL~', cityId: X}
    - Note cityId (X) must be the id of a city that already exists in the DB
  - `/api/users` Locates or adds user
    - Format: `{userId: ~oauthID~}`
      - Returns: `{exists: true, user: ~userObj~}` if exists, `{exists: true, user: ~userObj~}` otherwise
    - Creation format: `{userId: ~oauthID~, profileData: {name: ~, email: ~, phone: ~, photo: ~URL~, languages:[~, ~, ~], city: ~}}`
      - Returns `{exists: true, user: ~userObj~}` of the newly created user. If an oauthID that already exists is given, will just return the existing user