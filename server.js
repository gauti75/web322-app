/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Gautam Gandotra Student ID: 164064214 Date: 10/03/2023
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

const exphbs = require('express-handlebars');

const stripJs = require('strip-js');

var HTTP_PORT = process.env.PORT || 8080;


app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers:{
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },
        safeHTML: function(context){
            return stripJs(context);
        }
        
        
        
    }

}));

app.set('view engine', '.hbs');

app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/posts/add', (req, res) => {
    res.render('addPost');
});


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
    res.redirect("/blog");
});

// setup another route to listen on /about
app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
 });

 app.get('/posts/add',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','addPost.html'));
  
  });

  app.get('/blog/:id', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await blogService.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blogService.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the post by "id"
        viewData.post = await blogService.getPostById(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blogService.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})
});


 app.get('/blog', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await blogService.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await blogService.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // get the latest post from the front of the list (element 0)
        let post = posts[0]; 

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;
        viewData.post = post;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blogService.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})

});

// using the logic of promise of only categories with then and catch to show it on the website with the help of the get method
app.get("/categories",function(req,res){
    blogService.getCategories().then((categories)=>{
        res.render('categories', { categories: categories });
    }).catch((err)=>{
        res.render('categories', { message: 'no results' });
    });
});

// using the logic of promise of only All Posts with then and catch to show it on the website with the help of the get method
app.get("/posts",function(req,res){

    if(req.query.category){
        blogService.getPostsByCategory(req.query.category).then((data)=>{
            res.render('posts', { posts: data });
        }).catch((err)=>{
            res.render('posts', { message: 'no results' });
        })
    }
    else if(req.query.minDate){
        blogService.getPostsByMinDate(req.query.minDate).then(
            data => res.render('posts', { posts: data }),
            error => res.render('posts', { message: 'no results' })
        )
    }
    
    else{
        blogService.getAllPosts().then((categories)=>{
            res.render("posts", {posts: categories})
            
        }).catch((err)=>{
            res.render('posts', { message: 'no results' });
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

    



