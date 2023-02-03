/*********************************************************************************
*  WEB322 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: _________Gautam Gandotra_____________ Student ID: __164064214____________ Date: ____2/01/23____________
*
*  Online (Cyclic) URL: https://super-drawers-foal.cyclic.app/
*
********************************************************************************/ 

const path = require('path');
var blogService = require("./blog-service");
var express = require("express");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public')); 

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
    res.redirect("/about");
});

// setup another route to listen on /about
app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
 });

 app.get("/blog", (req, res) => {
    blogService
    .getPublishedPosts()
    .then(posts => {
    res.send(posts);
    }).catch(err => {
    console.error(err);
    res.send({message: err});});
});

app.get("/posts", (req, res) => {
    blogService
    .getAllPosts()
    .then(posts => {
    res.send(posts);
    }).catch(err => {
    console.error(err);
    res.send({message: err});});
});

app.get("/categories", (req, res) => {
    blogService
    .getCategories()
    .then(categories => {
    res.send(categories);
    }).catch((err) => {
    console.error(err);
    res.send({message: err});});
});


app.get("*", (req, res) => {
    res.status(404).send("Page Not Found");
});
 

// setup http server to listen on HTTP_PORT

blogService.initialize().then(()=>{
    app.listen(HTTP_PORT, onHttpStart);

}).catch(()=>{
    console.log("error");
});

    



