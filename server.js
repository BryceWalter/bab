"use strict";
require('dotenv').config();
const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const cookie = require("cookie-session");
const faker = require("faker");
const queries = require("./routes/userqueries");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));
app.use(cookie({
  name: 'session',
  keys:['username','userId']
}))

//******************************************DATABASE***************************************************//
// Seperated Routes for each Resource
const users = require("./routes/users");
const individualUser = require("./routes/get_one_user")
const allResources = require("./routes/resources")
const topics = require("./routes/topics")
const topicId = require("./routes/topicId")
const getSpecificResource = require("./routes/get_specific_resource")
const likedRoutes = require ("./routes/likedresource")
const registerForm = require ("./routes/registerForm")
const loginForm = require ("./routes/login")
const deleteResource = require ("./routes/delete_resource")


app.use("/api", users(knex))
<<<<<<< HEAD
app.use("/api/users", individualUser(knex)) //userId
=======
app.use("/api/users",  individualUser(knex))
>>>>>>> master
app.use("/api", allResources(knex))
app.use("/api", topics(knex))
app.use("/api/topics", topicId(knex))
app.use("/api/resources", getSpecificResource(knex))
app.use("/api", likedRoutes(knex))
app.use("", registerForm(knex))
app.use("", loginForm(knex))
app.use("/api", deleteResource(knex))


//******************************************DATA***************************************************//
// const users = {
//   "userID": {
//     first-name: "John"
//     last-name: "Cox"
//     username: "abd",
//     email: "user@example.com",
//     password: "purple-monkey-dinosaur"
//   },





//******************************************FUNCTION***************************************************//
// function checkforEmail(emailToCheck){
//     for(user in users){
//       if(users[user].email === emailToCheck){
//         return true;
//       }
//     }
//     return false;
// }
//
// function checkforUsername(usernameToCheck){
//   for(user in users){
//     if(users[user].username === usernameToCheck){
//       return true;
//     }
//   }
//   return false;
// }
// function checkforPassword(passwordToCheck){
//   for (user in users){
//     if(users[user].password === passwordToCheck){
//       return true;
//     }
//   }
//   return false;
// }
//**********************************************GET******************************************************//
// Home page -  is it necessary to add URL/?

app.get("/", (req, res) => {
console.log('>>>>>>>>>>>>', req.body['search-bar'])
var templateVars = {
  username:req.session.username,
  userId: req.session.userId,
  //searchText: req.body['search-bar']

  //addedresource:userDatabase
}
res.render("index", templateVars);
})

//users own page with liked sources and saved pins(customized topic)
app.get("/users/:userid",(req, res)=>{
  //console.log('>>>>>/users/:userid', req.session.username)
  var templateVars = {
    username:req.session.username,
    userId: req.params.userid,

  }
  res.render("user", templateVars);
})

//account settings to update profile
app.get("/users/:userid/settings", (req,res)=>{
  var templateVars = {
    username:req.session.username
  }
  res.render("account-settings", templateVars);
})

//*** filtered user own page
app.get("/users/:userid/:topic", (req,res)=>{
  var templateVars = {
    username:req.session.username
  }
  res.render("topics", templateVars);
})

//before login, Topic to browser after clicking the Discover Button
app.get("/topic", (req,res)=>{
  var templateVars = {
    username:req.session.username
  }
  res.render("topics", templateVars);
})

//filtered homepage
app.get("/topic/:topicid", (req,res)=>{
  var templateVars = {
    username:req.session.username
  }
  res.render("index", templateVars);
})

//categorizing saved pins by adding new resources to customized topic
app.get("/new", (req,res)=>{
  var templateVars = {
    username:req.session.username
  }
  res.render("add-resource", templateVars);
})

//Resource page to show clicked individual page and comments
app.get("/resources/:resourceid",(req,res)=>{
  var templateVars = {
    username:req.session.username
  }
  res.render("resource", templateVars);
})


//**********************************************POST******************************************************//


//Home - Logged In
app.post("/", (req, res)=>{

  //once logged in from home page, redirect to user page
  res.redirect("user");
})

//Delete - users pins/ownpage
app.post("/users/:userid/:resource_id/delete", (req,res)=>{
  delete resources[req.param.resource_id]
  res.redirect("user");
})

//Account-Setting - Update(PUT) users existing information
app.post("/users/:userid/settings", (req,res)=>{

  //page with updated info
  res.redirect("account-settings");
})

//Register
app.post("/register", (req,res)=>{
  if(req.body.email.length < 1 || req.body["register-password"].length < 1 ){
    res.status(400).send('please input something!');
  }

  req.session.username = req.body.username;
  //TODO
  req.session.userId = 1;
  res.redirect("/users/:userid");
})

//Login
app.post("/login",(req,res)=>{
  if(req.body.username.length < 1 || req.body["login-password"].length < 1 ){
    res.redirect("/login");
  }
  req.session.username = req.body.username;
  req.session.userId = 1;
  res.redirect("/users/:userid");
});

//Logout
app.post("/logout",(req,res)=>{
  delete req.session.username;
  res.redirect("/");
})

//adding to user's
app.post("/users/:userid/adding",(req,res)=>{
  //add more pin alert
  res.redirect("resource");
})

//Resource - updating comment
app.post("/resource/:resourceid/comments", (req,res)=>{

  //same page with CREATED comment
  res.redirect("/resource");
})

//Resource - DELETE resource
app.post("/user/:userid/:resourceid/delete", (req,res)=>{

  //delete user created comment
  res.redirect("/user/:userid");
})

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
