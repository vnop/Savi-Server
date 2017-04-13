# Savi-Server

### Seed File

The sampleData.js file will help will seed the DB or recreate and seed the tables if they already have data in it. Use it then as a starting or reset command.

config/config.js sets up some enviroment variables for the DB in development and production. It is git ignored, hence you should create and populate this file in the server manually. Careful when setting your personal port and the database name that should be created in mysql.

With that done, and the DB created on each environment, you should be able to type:

```> nodejs seed.js```


### API Endpoints
- GET
  - `/api/tours` gets all tours from the DB
  - `/api/tours?cityId=X` gets all tours for the city with ID of X
  - `/api/tours?tourId=X` gets the tour of that particular ID
  - `/api/cities` gets all cities from the DB
  - `/api/cities?cityId=X` gets the city with ID X
  - `/api/images/<imagename>` gets the image of that name