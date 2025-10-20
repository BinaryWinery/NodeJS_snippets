#!/usr/bin/node

//imports
const express = require('express'); //express framework
const session = require('express-session'); //express session module
require("dotenv").config(); //dotenv module to read from .env file
const path = require("path");//path module

//routes - external
const authRoutes = require("./Routes/auth");

//variables 
const PORT = process.env.PORT || 3000; //read PORT from .env or default 3000 (port for http server)
const SECRET = process.env.SECRET || "default_secret"; //read SECRET from .env or default "default_secret" (secret for express-session)

//initialize
const app = express(); //initialize express

//middlewares
app.set('view engine', 'ejs'); //ejs for  rendering (secrets.ejs)
app.use(express.json()); //middleware to parse json body
app.use(express.urlencoded({extended:true})); //middle ware to parse URL-encoded data (if using HTML forms)
app.use(session({
    secret:SECRET, //secret key
    resave:false, //The session will only be saved back to the store if you made some change to req.session during that request
    saveUninitialized:false, //only create session if soemthing set
    cookie:{
        maxAge: 1000 * 60 * 60 *2, //after 2 hours it will expire
        httpOnly:true, //if true : client side js cannot access cookie through document.cookie
        //secure:true //if using HTTPS in production
    }
}));

//middleware to check if user is authenticated
const isUserAUthenticated=(req,res,next)=>{
    if(req.session && req.session.user){return next();}
    else{res.redirect("/auth/login");}
}

app.use('/auth',authRoutes); //middleware to use auth routes


//page anyone can access
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"views","home.html"));
});

//secret page only authenticated users can access
app.get('/secret',isUserAUthenticated,(req,res)=>{
    res.render("secret",{message:req.session.user.name})
});


//start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


