/*********************************************************************************
*  WEB322 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Gautam Gandotra Student ID: 164064214 Date: 9/04/2023
*
*  Online (Cyclic) Link: https://proud-moccasins-bear.cyclic.app/
*
********************************************************************************/ 


const path = require('path');// getting the path module 
var blogService = require("./blog-service");// getting the blog-service.js to use its functions
var express = require("express");// getting the express module
var app = express();

var authData=require("./auth-service");

const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const exphbs = require('express-handlebars');

const stripJs = require('strip-js');

const clientSessions=require('client-sessions');


// setting up the Client Session

app.use(express.static("static"));

// Setup client-sessions
app.use(clientSessions({
  cookieName: "session", 
  secret: "GautamGandotraWebApp", 
  duration: 1 * 60 * 1000, 
  activeDuration: 1000 * 60 *2
}));

// using middleware
app.use(express.urlencoded({extended: true}));


app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
  });
  
// Middleware for checking authentication
  function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      next();
    }
  }




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
        },
        formatDate: function(dateObj){
            let year = dateObj.getFullYear();
            let month = (dateObj.getMonth() + 1).toString();
            let day = dateObj.getDate().toString();
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2,'0')}`;
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

// setting up the route to listen to about page
app.get("/about", (req, res) => {
    res.render("about");
});

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
    res.redirect("/blog");
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





 



  // Get route for blog/id

  app.get('/blog/:id', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{

        // declare empty array to hold "post" objects
        let posts_array = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts_array = await blogService.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts_array = await blogService.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts_array.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        view.posts = posts_array;

    }catch(err){
        view.message = "no results";
    }

    try{
        // Obtain the post by "id"
        view.post = await blogService.getPostById(req.params.id);
    }catch(err){
        view.message = "no results"; 
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blogService.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        view.categories = categories;
    }catch(err){
        view.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: view})
});


 app.get('/blog', async (req, res) => {

    // Declare an object to store properties for the view
    let view = {};

    try{

        // declare empty array to hold "post" objects
        let posts_array = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts_array = await blogService.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts_array = await blogService.getPublishedPosts();
        }

        // sort the published posts by postDate
        posts_array.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        // get the latest post from the front of the list (element 0)
        let post = posts_array[0]; 

        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        view.posts = posts_array;
        view.post = post;

    }catch(err){
        view.message = "no results";
    }

    try{
        // Obtain the full list of "categories"
        let categories = await blogService.getCategories();

        // store the "categories" data in the viewData object (to be passed to the view)
        view.categories = categories;
    }catch(err){
        view.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: view})

});


/////////////////////////////********************CATEGORIES ROUTE****************************////////////////////////////////////////

// using the logic of promise of only categories with then and catch to show it on the website with the help of the get method

app.get("/categories",ensureLogin,function(req,res){
    blogService.getCategories().then((data)=>{
        if(data){
            console.log(data);
            res.render('categories', { categories: data });
        }
        else{
           

            res.render('categories', { message: 'no results' });
        }
    }).catch((err)=>{
        
        res.render('categories', { message: 'no results' });
    });
});

// Get route for categories/add

app.get("/categories/add",ensureLogin, (req, res) => {
    res.render("addCategory");
  });

  app.post("/categories/add", ensureLogin,(req, res) => {
    blogService.addCategory(req.body).then(post=>{
        res.redirect("/categories");
    }).catch(err=>{
        res.status(500).send(err);
    })
  });

  // Get route for posts

app.get('/posts',ensureLogin, (req, res) => {

    let queryPromise = null;

    if (req.query.category) {
        queryPromise = blogService.getPostsByCategory(req.query.category);
    } else if (req.query.minDate) {
        queryPromise = blogService.getPostsByMinDate(req.query.minDate);
    } else {
        queryPromise = blogService.getAllPosts()
    }
    

    queryPromise.then(data => {
        console.log(data);
        res.render("posts", {posts: data});
    }).catch(err => {
       
        res.render("posts", {message: "no results"});
    })

});


// GEt route for posts/add

app.get('/posts/add',ensureLogin,(req,res)=>{
    blogService.getCategories().then(function(data){
        res.render("addPost", {categories: data});
    }).catch((err)=>{
        res.render("addPost", {categories: []}); 
    })
   // res.sendFile(path.join(__dirname,'views','addPost.html'));
  
  });

  // Post route for posts/add

  app.post("/posts/add",ensureLogin, upload.single("featureImage"), (req,res)=>{

    if(req.file){
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
            processPost(uploaded.url);
        });
    }else{
        processPost("");
    }

    function processPost(imageUrl){
        req.body.featureImage = imageUrl;

        blogService.addPost(req.body).then(post=>{
            res.redirect("/posts");
        }).catch(err=>{
            res.status(500).send(err);
        })
    }   
});

    
    




/////////////////////***************Deleting Categories******************************///////////////////////////

app.get("/categories/delete/:id",ensureLogin,function(req,res){
    blogService.deleteCategoryById(req.params.id).then(()=>{
        res.redirect("/categories");
    }).catch((err)=>{
        res.status(500).send(err.message);
        console.log("Unable to Remove Category / Category not found)");
    });
})


/////////////////////***************Deleting Posts******************************///////////////////////////

app.get("/posts/delete/:id",ensureLogin,function(req,res){
    blogService.deletePostById(req.params.id).then(()=>{
        res.redirect("/posts");
    }).catch((err)=>{
        res.status(500).send(err.message);
        console.log("Unable to Remove Post / Post not found)");
    });
})




// login route

app.get('/login', function(req, res) {
    res.render('login');
  });


  // register route
  app.get("/register", function(req, res) {
    res.render("register");
  });


  // post register route

  app.post('/register', function(req, res) {
    authData.registerUser(req.body)
    .then(() => {
      res.render('register', { successMessage: 'User created' });
    })
    .catch((err) => {
      res.render('register', { errorMessage: err, userName: req.body.userName });
    });
  });


  // post login


  app.post('/login', function(req, res) {
    req.body.userAgent = req.get('User-Agent');
    authData.checkUser(req.body).then((user) => {
        req.session.user = {
            userName:user.userName, // authenticated user's userName
            email: user.email,// authenticated user's email
            loginHistory: user.loginHistory// authenticated user's loginHistory
        };
        res.redirect('/posts');
        
    }).catch((err) => {
      res.render('login', { errorMessage: err, userName: req.body.userName });
    });
  });


  // logout route

  app.get('/logout', function(req, res) {
    req.session.reset();
    res.redirect("/");
  });

  // get userHistory

  app.get("/userHistory", ensureLogin, function(req, res) {
    res.render('userHistory');
  });


// This will show if any link does not work in the website
app.get("*", (req, res) => {
    res.status(404).send("OOPS! Page Not Found");
});
 

// setup http server to listen on HTTP_PORT

blogService.initialize().then(authData.initialize()).then(()=>{
    app.listen(HTTP_PORT, onHttpStart);

}).catch(()=>{
    console.log("error");
});

    
