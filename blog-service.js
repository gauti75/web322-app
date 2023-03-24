

const Sequelize = require('sequelize');
// Setting up the sequelize module
var sequelize = new Sequelize('ssiqaonl', 'ssiqaonl', 'p5XrxeUiLvYfYqvaNfpRhPWKy-5zX4ZW', {
    host: 'isilo.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

// Create the post data module using sequelize

var post = sequelize.define('post', {
    body:Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN

});

// Creating the category data module using sequelize

var Category = sequelize.define('Category', {
    category: Sequelize.STRING
    
});

//Relationship between post and category
post.belongsTo(Category, {foreignKey: 'category'});


module.exports.initialize= function (){
    return new Promise((resolve,reject) =>{
        sequelize.sync().then(()=>{
            console.log(" sync the database");

            resolve();

        }).catch(()=>{
            reject("unable to sync the database");
        });
       
        

    })
}


module.exports.getAllPosts=function(){
    // using post.findAll() method to resolve the data using promise
    return new Promise((resolve,reject)=>{
        post.findAll().then((data)=>{
          
            resolve(data);
        }).catch(()=>{
            reject("no results returned");
        })


    });
}

module.exports.getPublishedPosts= function (){
    // using where property of the data to get the posts which are published by setting published to true
    return new Promise((resolve,reject)=>{
        post.findAll({
            where:{
                published:true
            }
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        })
       

    });
}



module.exports.getCategories=function(){
    
    return new Promise((resolve,reject)=>{
        
        Category.findAll().then((data)=>{

            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        })
        
    });
}

module.exports.addPost=function(postData){
    postData.published = (postData.published) ? true : false;
    return new Promise((resolve,reject)=>{
        
        for(let i in postData){
            if(postData[i]==""){
                postData[i]=null;
            }
        }
        postData.postDate=new Date(); // assigning date
        post.create(postData).then((data)=>{
          
            resolve(data);
        }).catch((err)=>{
             reject("unable to create post");
             });
            })
        }  
    
module.exports.addCategory=function(categorydata){

    for(let i in categorydata){
        if(categorydata[i]==""){
            categorydata[i]=null;
        }
    }

    return new Promise((resolve,reject)=>{
        
        console.log(categorydata);
        Category.create(categorydata).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("unable to create category");
        })
    });
}


module.exports.deleteCategoryById=function(id){
    return new Promise((resolve,reject)=>{
        Category.destroy({
            where:{
                id:id
            }
        }).then(()=>{
            resolve("destroyed");
        }).catch((err)=>{
            reject("error in deleting category");
        })
    })
}

module.exports.deletePostById=function(id){
    return new Promise((resolve,reject)=>{
        post.destroy({
            where:{
                id:id
            }
        }).then(()=>{
            resolve("destroyed");
        }).catch((err)=>{
            reject("error in deleting post");
        })
    })
}




module.exports.getPublishedPostsByCategory= function (){
    return new Promise((resolve,reject)=>{
        // using the where method of post.findAll() to have categories whose published property are true
        post.findAll({
            where:{
                published:true,
                category: category
            }
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        })
       

    });
}


module.exports.getPostsByCategory=function(category){
    return new Promise((resolve,reject)=>{
       post.findAll().then((data)=>{
        resolve(data);
       }).catch(()=>{
        reject("no results returned");
       })


    })
}

module.exports.getPostsByMinDate=function(minDateStr) {
    return new Promise((resolve,reject)=>{
        const { gte } = Sequelize.Op;
        post.findAll({
            where: {
                 postDate: {
                    [gte]: new Date(minDateStr)
                }
            }
        }).then((data)=>{
            resolve(data);
        }).catch(()=>{
            reject("no results returned");
        })

      

    })
}


module.exports.getPostById=function(id){
    return new Promise((resolve,reject)=>{
        post.findAll({
            where:{id: id}
        }).then((data)=>{
            resolve(data[0]);
        }).catch(()=>{
            reject("no results returned");
        })
       
       
       

    })
}