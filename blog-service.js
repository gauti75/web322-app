// Using the fs module to read the file as it is important 

const fs=require("fs");// required at the top of your module

let posts=[];// initializing posts array to zero
let categories=[];// initializing categories array to zero


module.exports.initialize= function (){
    return new Promise((resolve,reject)=>{
        // using readFile from fs module to successfully read the file posts.json which is inside the data directory
        fs.readFile('./data/posts.json', 'utf8', (err, data) => {
            if (err){
                reject("unable to read file");
            }
            else{
                //  Using the parse function to make the posts json data which is a collection of objects into an array of objects 
                // so that it can  easily used to pass as a data and also to easily calculate its length.
                posts=JSON.parse(data);
            
           
            // using readFile from fs module to successfully read the file categories.json which is inside the data directory
            fs.readFile('./data/categories.json', 'utf8', (err, data) => {
                if (err){
                    // calling the reject if there is error in reading file
                    reject("unable to read file");
                }
                else{
                    //  Using the parse function to make the categories json data which is a collection of objects into an array of objects 
                    // so that it can  easily used to pass as a data and also to easily calculate its length.

                categories=JSON.parse(data);
                resolve();
                }
            });
        }
        });
        

    })
}


module.exports.getAllPosts=function(){
    // Using Promise to get the data if the length of the array posts is not true or 
    // shows no message returned using reject if the length is zero.
    return new Promise((resolve,reject)=>{
        if(posts.length==0){
            reject("no results returned");
        }
        else{
            
            resolve(posts);
        }
    });
}

module.exports.getPublishedPosts= function (){
    return new Promise((resolve,reject)=>{
        

        function pub_p(posts){
            return posts.published===true;
        }
        let published_posts=posts.filter(pub_p);// using array. filter method to get the required filtered data set form the posts array
        if(posts.length==0){
            // Using Promise to get the data if the length of the array posts which published are not true or 
            // shows no message returned using reject if the length of the required posts is zero.
            reject("no results returned");
        }
        else{
            resolve(published_posts);
        }
    });
}

module.exports.getCategories=function(){
    // Using Promise to get the data if the length of the array categories is not true or 
    // shows no message returned using reject if the length is zero.
    return new Promise((resolve,reject)=>{
        if(categories.length==0){
            reject("no results returned");
        }
        else{
            resolve(categories);
        }
    });
}