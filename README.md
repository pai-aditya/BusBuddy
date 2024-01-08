# BusBuddy
Welcome to BusBuddy, a comprehensive bus booking system built on the MERN (MongoDB, Express.js, React.js, Node.js) stack. It's designed to streamline the bus booking process, manage seat reservations, and oversee bus and user data efficiently.

## Key Aspects:
* Robust authentication via Passport.js and Google OAuth2.
* CRUD operations via various API endpoints.
* Error handling and validation for data integrity.

## User Experience:
* Home Page with bus listings and search functionality.
* Ability to view bus details and available seats and book seats accordingly.
* My Bookings Page for user booking management and delete booking functionalities.

## Admin Privileges:
* Managing Bus Details and all the CRUD operations on buses.
* Ability to view every user's booking.
## [Demo](https://drive.google.com/drive/folders/1_wTWp4WCw5m3jIRNNycu47srrv9QKAe8)

## Tech Stack

* **Frontend:** React with Tailwind CSS
* **Backend:** Node.js with Express
* **Database:** MongoDB

## Getting Started

Clone the repository
`git clone https://github.com/pai-aditya/BusBuddy.git`

### Update .env file


This project utilizes an .env file to manage environment-specific configuration settings. Ensure the following variables are properly set in your .env file in your backend folder:

- `MONGO_CONNECTION:` Connection string to your MongoDB cluster where user data for MovieVerse is stored. Please follow [This tutorial](https://dev.to/dalalrohit/how-to-connect-to-mongodb-atlas-using-node-js-k9i) to create your mongoDB connection url, which you'll use as your MONGO_CONNECTION.


- `CLIENT_ID and CLIENT_SECRET:` Google OAuth credentials required for authentication within the application. To get your Google ClientID for authentication, go to the [credential Page ](https://console.cloud.google.com/apis/credentials) (if you are new, then [create a new project first](https://console.cloud.google.com/projectcreate) and follow the following steps).


- `CLIENT_URL:` The URL where the frontend of MovieVerse is hosted. (e.g., http://localhost:5173)

- `SERVER_URL:` The URL where the backend server of MovieVerse is hosted. (e.g., http://localhost:5555)

**Server side**


```
cd server
```

```
npm i
```

```
nodemon index.js
```

The server will start running on localhost:5555.

***Client Side***


```
cd client
```

```
npm i
```

```
npm run dev
```

The client will start running on localhost:5173.

## Author

- Github: [pai-aditya](https://github.com/pai-aditya)
- Linkedin: [Aditya Pai](https://www.linkedin.com/in/aditya-pai-581b2621a/)
- Email: [pai.aditya2011@gmail.com](mailto:pai.aditya2011@gmail.com)