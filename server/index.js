import express from "express";
import mongoose from 'mongoose';
import cors from "cors";
import dotenv from 'dotenv';
import session from "express-session";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import passportLocalMongoose from "passport-local-mongoose";
import findOrCreate from "mongoose-findorcreate";



const PORT = process.env.PORT || 5000;



dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: `${process.env.CLIENT_URL}`,
  credentials: true,
}));
app.use(express.urlencoded({extended: true}));

app.use(session({
  secret: "TheMovieVerseProject",
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());




mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT} at ${new Date()}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

const busSchema = new mongoose.Schema({
  id:Number,
  name:String,
  total_seats:Number,
  seatsBooked:[Number],
  from:String,
  to:String,
  time_from: String,
  time_to: String,
  days:String,
  distance:String,
  duration:String,
  fare:Number,
});
const Bus = new mongoose.model("Bus",busSchema);

const bookingSchema = new mongoose.Schema({
  busID: Number,
  busName: String,
  bookedSeats:[Number],
  cost:Number,
});
const Booking = new mongoose.model("Booking",bookingSchema);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String,
  displayName:String,
  photos: String,
  bookings: [bookingSchema]
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
  },
  function(accessToken, refreshToken, profile, callback) {
    console.log(profile);
    User.findOrCreate({ username:profile._json.email, googleId: profile.id , displayName: profile.displayName, photos:profile._json.picture, email:profile._json.email}, function (err, user) {
      return callback(err, user);
    });
  }
))

app.get("/auth/google",
    passport.authenticate("google", {scope:["profile","email"]})
);


app.get("/auth/google/callback", 
  passport.authenticate("google", { failureRedirect: "/auth/login/failed" }),
  function(req, res) {
    return res.redirect(`${process.env.CLIENT_URL}/profile`);
  }
);

app.get("/auth/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

app.get("/auth/logout",function(req,res){
  req.logOut(function(err){
      if(err){
          console.log("logout error: "+err);
      }
  });
  res.redirect(`${process.env.CLIENT_URL}`)
});



/**
 * registers the new user
 */
app.post("/register",function(req,res){
    console.log("entering register api with username: "+req.body.username+" password: "+req.body.password+" with the displayName: "+req.body.displayName);
    User.register({username: req.body.username, displayName: req.body.displayName}, req.body.password, function(err, user){
        if (err) {
          console.log(err);
          res.status(500).json({ success: false, message: "Registration failed" });
  
        } else {
          passport.authenticate("local")(req, res, function(){
            res.status(200).json({ success: true, message: "Registration successful" });
          });
        }
      });
});
  
/**
 * logs in the already registered user
 */
app.post("/login",function(req,res){
    console.log("entering register api with username: "+req.body.username+" password: "+req.body.password);
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err){
        if (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "Login failed" });
        }else{
            passport.authenticate("local")(req, res, function(){
            res.status(200).json({ success: true, message: "Login successful" });
            });
        }
    });
});
  
/**
 * checks if the user is authenticated or not 
 * if authenticated returns the user details
 */
app.get("/auth/check", (req,res) => {
    if (req.isAuthenticated()) {
      // Access the user's data from req.user
      console.log(JSON.stringify(req.user));
      res.json({ user: req.user });
    } else {
      console.log(`entering not authenticated phase at ${new Date()}`);
      res.status(401).json({ message: "Unauthorized" });
    }
});



/**
 * adds/updates a new bus in the database (admins only)
 */
app.post("/addBus", async (req, res) => {
  try {
    const {
      id,
      name,
      total_seats,
      seatsBooked,
      from,
      to,
      time_from,
      time_to,
      days,
      distance,
      duration,
      fare,
      check
    } = req.body;

    
    let existingBus = await Bus.findOne({ id });

    if (existingBus && check) {
      // If the bus exists and comming from modifyBus page, update its details
      existingBus.set({
        name,
        total_seats,
        seatsBooked,
        from,
        to,
        time_from,
        time_to,
        days,
        distance,
        duration,
        fare
      });

      await existingBus.save();

      res.status(200).json({ success: true, message: 'Bus details updated', bus: existingBus });
    }else if(existingBus && !check){
      // If the bus exists and comming from addBus page, then return
      res.status(404).json({ success: false, message: 'Bus cannot be added',  });
    } else {
      // If the bus doesn't exist, create a new bus
      const newBus = new Bus({
        id,
        name,
        total_seats,
        seatsBooked,
        from,
        to,
        time_from,
        time_to,
        days,
        distance,
        duration,
        fare
      });

      await newBus.save();

      res.status(201).json({ success: true, message: 'New bus created', bus: newBus });
    }
  } catch (error) {
    console.error('Error creating/modifying bus:', error);
    res.status(500).json({ success: false, message: 'Failed to create/modify bus', error: error.message });
  }
});

/**
 * delete a particular bus (admins only)
 */
app.delete("/deleteBus/:id", async (req, res) => {
  const busIDToDelete = req.params.id;

  try {
    const deletedBus = await Bus.findOneAndDelete({ id: busIDToDelete });

    if (!deletedBus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    res.status(200).json({ success: true, message: "Bus deleted successfully", deletedBus });
  } catch (error) {
    console.error("Error deleting bus:", error.message);
    res.status(500).json({ success: false, message: "Bus deletion failed", error: error.message });
  }
});

/**
 * get all the users data (admins only)
 */
app.get("/getUsers", async (req, res) => {
  try {
      const allUsers = await User.find({});
      res.status(200).json({ success: true, users: allUsers });
  } catch (error) {
      console.log("Error retrieving users:", error.message);
      res.status(500).json({ success: false, message: "Failed to retrieve users" });
  }
});


/**
 * fetch all the buses from the database
 */
app.get("/getBuses", async (req, res) => {
  try {
    const allBuses = await Bus.find({});

    if (!allBuses || allBuses.length === 0) {
      return res.status(404).json({ success: false, message: "No buses found" });
    }

    res.status(200).json({ success: true, buses: allBuses });
  } catch (error) {
    console.error("Error fetching buses:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch buses", error: error.message });
  }
});

/**
 * fetch all the buses with the search query
 */
app.get("/getBusesByLocation", async (req, res) => {
  try {
    let query = {};
    const { from, to } = req.query;

    if (from) {
      query.from = { $regex: new RegExp(from, "i") };
    }

    if (to) {
      query.to = { $regex: new RegExp(to, "i") };
    }

    const buses = await Bus.find(query);

    if (!buses || buses.length === 0) {
      return res.status(404).json({ success: true, message: "No matching buses found",buses:[] });
    }

    res.status(200).json({ success: true, buses });
  } catch (error) {
    console.error("Error fetching buses:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch buses", error: error.message });
  }
});





/**
 * fetch a particular bus from the list of buses available
 */
app.get("/getBus/:id", async (req, res) => {
  try {
    const busID = req.params.id;

    const bus = await Bus.findOne({ id: busID });

    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    res.status(200).json({ success: true, bus });
  } catch (error) {
    console.error("Error fetching bus details:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch bus details", error: error.message });
  }
});

/**
 * add the occupancy to the buses database when the user creates a booking
 */
app.post("/bus/addOccupancy", async (req, res) => {
  const busId = req.body.id;
  const numbersToAdd = req.body.selectedSeats;

  try {
      const bus = await Bus.findOne({ id: busId });

      if (!bus) {
          return res.status(404).json({ success: false, message: "Bus not found" });
      }

      numbersToAdd.forEach(number => {
          bus.seatsBooked.push(number);
      });

      await bus.save();

      res.status(200).json({ success: true, message: "Occupancy updated", bus: bus });
  } catch (error) {
      console.log("Error updating occupancy:", error.message);
      res.status(500).json({ success: false, message: "Failed to update occupancy" });
  }
});



/**
 * book seats in a particular bus by the logged in user.
 */
app.post("/booking/book", async (req, res) => {
    const submittedBusID = req.body.id;
    const submittedBusName = req.body.busName;
    const submittedBookedSeats = req.body.selectedSeats;
    const submittedCost = req.body.cost;
    const newBooking = new Booking({
      busID:submittedBusID,
      busName:submittedBusName,
      bookedSeats:submittedBookedSeats,
      cost:submittedCost
    });
    console.log("request recieved",JSON.stringify(newBooking));
    User.findById(req.user._id)
      .then(function(foundUser){
        if (foundUser) {
          // Add the new booking to the user's bookings array
          foundUser.bookings.push(newBooking);

          foundUser.save()
              .then(function () {
                  res.status(200).json({ success: true, message: "Booking successful",});
              })
              .catch(function (err) {
                  res.status(500).json({ success: false, message: "Booking failed" });
              });
          } else {
            res.status(404).json({ success: false, message: "User not found" });
          }
      })
      .catch(function(err){
        console.log("entering this 1"+err.message);
        res.status(200).json({ success: false, message: "Review failed" });
      })
});

/**
 * remove occupancy from the bus database when the user deletes the booking
 */
app.post("/bus/removeOccupancy/:id", async (req, res) => {
  const busId = req.params.id;
  const numbersToRemove = req.body.seatsToRemove;
  console.log("id",busId);
  console.log("seats to revmoe",numbersToRemove);
  try {
      const bus = await Bus.findOne({ id: busId });

      if (!bus) {
          return res.status(404).json({ success: false, message: "Bus not found" });
      }

      numbersToRemove.forEach(number => {
          const indexToRemove = bus.seatsBooked.indexOf(number);
          if (indexToRemove !== -1) {
              bus.seatsBooked.splice(indexToRemove, 1);
          }
      });

      await bus.save();

      res.status(200).json({ success: true, message: "Occupancy updated", bus: bus });
  } catch (error) {
      console.log("Error updating occupancy:", error.message);
      res.status(500).json({ success: false, message: "Failed to update occupancy" });
  }
});


/**
 * delete the booking from the users booking list
 */
app.delete("/booking/delete/:bookingID", async (req, res) => {
  const bookingId = req.params.bookingID;

  try {
    const users = await User.find();
    let updatedUsers = [];

    for (const foundUser of users) {
      const indexToRemove = foundUser.bookings.findIndex(booking => booking._id == bookingId);
      if (indexToRemove !== -1) {
        foundUser.bookings.splice(indexToRemove, 1);
        updatedUsers.push(foundUser); // Collecting users to update
      }
    }

    if (updatedUsers.length > 0) {
      const promises = updatedUsers.map(user => user.save()); // Saving all updated users
      await Promise.all(promises);
      res.status(200).json({ success: true, message: "Booking deleted" });
    } else {
      res.status(404).json({ success: false, message: "Booking not found" });
    }
  } catch (err) {
    console.log("Error deleting booking:", err.message);
    res.status(500).json({ success: false, message: "Failed to delete booking" });
  }
});


/**
 * When the bus is deleted by the admin, 
 * delete all the bookings with the given busID 
 */
app.delete("/deleteBookings/:busID", async (req, res) => {
  try {
    const { busID } = req.params;

    const users = await User.find();

    for (const foundUser of users) {
      const indexToRemove = foundUser.bookings.findIndex(booking => booking.busID == busID);
      if (indexToRemove !== -1) {
          foundUser.bookings.splice(indexToRemove, 1);
          
          await foundUser.save();
      }
    }

    res.status(200).json({ success: true, message: "Bookings deleted successfully" });
  } catch (error) {
    console.error("Error deleting bookings:", error);
    res.status(500).json({ success: false, message: "Failed to delete bookings", error: error.message });
  }
});


/**
 * get all the bookings list of the current user
 */
app.get("/bookings/getBookings", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user._id)
      .populate("bookings")
      .exec()
      .then((user) => {
        if (user) {
          const userBookings = user.bookings;
          res.status(200).json({ bookings : userBookings });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((err) => {
        console.error("Error fetching user reviews:", err);
        res.status(500).json({ message: "Internal server error" });
      });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

/**
 * get all the bookings list of the user with the given id
 */
app.get("/bookings/getBookings/:id", (req, res) => {
  const {id} = req.params;
  if (req.isAuthenticated()) {
    User.findById(id)
      .populate("bookings")
      .exec()
      .then((user) => {
        if (user) {
          const userBookings = user.bookings;
          res.status(200).json({ bookings : userBookings });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((err) => {
        console.error("Error fetching user reviews:", err);
        res.status(500).json({ message: "Internal server error" });
      });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});


/**
 * Welcome message for the SERVER page
 */
app.get("/",(req,res)=>{
    return res.send("Welcome to my Bus Booking System");
  });
  