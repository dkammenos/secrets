//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

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


app.listen(process.env.PORT || 3000, () => {
    console.log("O Server τρέχει στην πόρτα 3000");
    }); 
  