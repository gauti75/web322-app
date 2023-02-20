/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Gautam Gandotra Student ID: 164064214 Date: 19/02/2023
*
*  Online (Cyclic) Link: https://proud-moccasins-bear.cyclic.app/
*
********************************************************************************/ 


const path = require('path');// getting the path module 
var blogService = require("./blog-service");// getting the blog-service.js to use its functions
var express = require("express");// getting the express module
var app = express();


const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')



var HTTP_PORT = process.env.PORT || 8080;

cloudinary.config({
    cloud_name: 'dl9vqrg1s',
    api_key: '753157719778192',
    api_secret: 'I4UuGGP1eXTTIEmh7AGAemOQswc',
    secure: true
});

const upload = multer(); // no { storage: storage } since we are not using disk storage

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

 app.get('/posts/add',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','addPost.html'));
  
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

    if(req.query.category){
        blogService.getPostsByCategory(req.query.category).then((data)=>{
            res.send(data);
        }).catch((err)=>{
            res.send({message: err});
        })
    }
    else if(req.query.minDate){
        blogService.getPostsByMinDate(req.query.minDate).then(
            data => res.send(data),
            error => res.send({message: err})
        )
    }
    
    else{
        blogService.getAllPosts().then((categories)=>{
            res.send(categories);
        }).catch((err)=>{
            res.send({message: err});
        });
    }
 

    
});

app.get("/post",function(req,res){
  const id = req.params;
        blogService.getPostById(id).then((data)=>{
            res.send(data);
        }).catch((err)=>{
            res.send({message: err});
        })

});



app.post("/posts/add", upload.single("featureImage"),(req,res) => {
  
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream(
              (error, result) => {
              if (result) {
                  resolve(result);
              } else {
                  reject(error);
              }
              }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
  };
  
  async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
  }
  upload(req).then((uploaded)=>{
    req.body.featureImage = uploaded.url;

    // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
    blogService.addPost(req.body).then(() =>
  {

    res.redirect("/posts");

  })
});
});




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

    



