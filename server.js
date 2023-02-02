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


var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.send("Gautam Gandotra - 164064214");
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);

