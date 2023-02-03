//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
//const encrypt = require("mongoose-encryption" Level)
//const md5 = require("md5" Lever 3);
//Level 4 bcrypt
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
//Level 5 - Session & Cookies
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
//Level 6 - oAuth Google
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate')

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({ 	
    secret: "Our little secret",
    resave: false, 
    saveUninitialized: false }
  ));
  app.use(passport.initialize());
  app.use(passport.session());
  
//TODO
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/userDB',{useNewUrlParser:true});


const userSchema = new mongoose.Schema( {
    email:String,
    password:String
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);


secret=process.env.SECRET;

//userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});

const User = mongoose.model("User",userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());
//Google oAuth code
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));


app.get("/",(req, res)=> {

  
    //res.render("list", {listTitle: day, newListItems: defautItems});
    //res.render("list", {listTitle: day, newListItems: workItems});
    res.render("home");
  
  });

  app.get("/login",(req, res)=> {
    res.render("login");
  
  });



app.get("/register",(req, res)=> {
  res.render("register");

  
  });
  app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

    app.get("/secrets", function(req, res){
      if (req.isAuthenticated()){ 
       res.render("secrets");
       } else {
       res.redirect("/login") 
       }
       })

    //password: md5(req.body.password)
  app.post("/register",(req, res)=> {
    User.register({username: req.body.username}, req.body.password, function(err, user){ if (err) {
      console.log(err);
      res.redirect("/register");
      } else {
      passport.authenticate("local") (req, res, function(){
      res.redirect("/secrets");
      });
      }
});

   
    });

    app.post("/login", function(req, res){
      const user = new User({ username: req.body.username, password: req.body.password });
      req.login(user, function(err){ if (err) {
      console.log(err);
      } else { passport.authenticate("local")(req, res, function(){ 
        res. redirect("/secrets");
      }); }
      });
    });
     

app.listen(process.env.PORT || 3000, () => {
    console.log("O Server τρέχει στην πόρτα "+ process.env.PORT);
    }); 
  