// Using the fs module to read the file as it is important 

const fs=require("fs");

let posts=[];
let categories=[];


module.exports.initialize= function (){
    return new Promise((resolve,reject) =>{
        
        fs.readFile('./data/posts.json', 'utf8', (err, data) => {
            if (err){
                reject("unable to read file");
            }
            else{
                
                posts=JSON.parse(data);
            
           
           
            fs.readFile('./data/categories.json', 'utf8', (err, data) => {
                if (err){
                    
                    reject("unable to read file");
                }
                else{
                    

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

module.exports.addPost=function(postData){
    return new Promise((resolve,reject)=>{
        if(postData.published==undefined){
            postData.published=false;
        }
        else{
            postData.published=true;
        }
        postData.id = posts.length + 1;
        posts.push(postData);

        resolve(postData);


    })
}


module.exports.getPostsByCategory=function(category){
    return new Promise((resolve,reject)=>{
        let required_posts=posts.filter(posts => posts.category==category);
        if(required_posts.length!=0){
            resolve(required_posts);
        }
        else{
            reject("no results returned");
        }
    })
}

module.exports.getPostsByMinDate=function(minDateStr) {
    return new Promise((resolve,reject)=>{
        let post_Dates = posts.filter(posts => posts.postDate >= minDateStr);
        if(post_Dates.length==0){
            reject("no results returned");
        }
        else{
            resolve(post_Dates);
        }
    })
}


module.exports.getPostById=function(id){
    return new Promise((resolve,reject)=>{
        
        let required_id=posts.filter(posts => posts.id==id);
        if(required_id.length != 0){        
            
            resolve(required_id);
        }
        else{
            reject("no results returned");
        }
    })
}