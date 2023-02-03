/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Gautam Gandotra Student ID: 164064214 Date: 03/02/2023
*
*  Online (Cyclic) Link: https://proud-moccasins-bear.cyclic.app/
*
********************************************************************************/ 


const path = require('path');// getting the path module 
var blogService = require("./blog-service");// getting the blog-service.js to use its functions
var express = require("express");// getting the express module
var app = express();

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// to use the css file.
app.use(express.static(__dirname)); 

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
    res.redirect("/about");
});

// setup another route to listen on /about
app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
 });

 // using the logic of promise of only published posts with then and catch to show it on the website with the help of the get method
app.get("/blog",function(req,res){
    blogService.getPublishedPosts().then((posts)=>{
        res.send(posts);
    }).catch((err)=>{
        res.send({message: err});
    });
})

// using the logic of promise of only categories with then and catch to show it on the website with the help of the get method
app.get("/categories",function(req,res){
    blogService.getCategories().then((categories)=>{
        res.send(categories);
    }).catch((err)=>{
        res.send({message: err});
    });
});

// using the logic of promise of only All Posts with then and catch to show it on the website with the help of the get method
app.get("/posts",function(req,res){
    blogService.getAllPosts().then((categories)=>{
        res.send(categories);
    }).catch((err)=>{
        res.send({message: err});
    });
})

// This will show if any link does not work in the website
app.get("*", (req, res) => {
    res.status(404).send("OOPS! Page Not Found");
});
 

// setup http server to listen on HTTP_PORT

blogService.initialize().then(()=>{
    app.listen(HTTP_PORT, onHttpStart);

}).catch(()=>{
    console.log("error");
});

    



