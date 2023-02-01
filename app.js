//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
//const encrypt = require("mongoose-encryption")
const md5 = require("md5");

const app = express();

console.log(process.env.API_KEY);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/userDB',{useNewUrlParser:true});

const userSchema = new mongoose.Schema( {
    email:String,
    password:String
});

secret=process.env.SECRET;

//userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});

const User = mongoose.model("User",userSchema);


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

  app.post("/register",(req, res)=> {
    const newUser = new User({
      email:req.body.username,
      password: md5(req.body.password)
      });
        newUser.save((err)=> {
          if (err) {
            console.log(err)
          } else {
            res.render("secrets");
          }
          });    
    });

    app.post("/login",(req, res)=> {
      username = req.body.username;
      password = md5(req.body.password);
      User.findOne({email:username}, function (err, foundUser){
        if (err) {
          console.log("lathos");
          res.render("home")
        }else {
          if(foundUser) {
            if (foundUser.password=== password) {
              console.log(password);
              res.render("secrets")
            }
          }
        }
      });
    });

     

app.listen(process.env.PORT || 3000, () => {
    console.log("O Server τρέχει στην πόρτα "+ process.env.PORT);
    }); 
  