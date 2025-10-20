const express = require('express');
const router = express.Router();
const path = require("path"); //path module to set path
const db = require('../Sql_database/sqlite3_database'); //sqli3 database custom module


//DATABASE FUNCTIONS

//add user to database
const addUserToDb=(name,email,phone,password,res)=>{
    const sql = `INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)`;
    const params = [name,email,phone,password];
    db.run(sql,params,(err)=>{
        if(err){
            //if user exists already
            if(err.message.includes('UNIQUE constraint failed')){
                return res.send(`User with that email/phone already exists, If thats you, Please Login <a href="/auth/login">Login</a> `)
            }
            //any other inserting error
            console.log("Error insering user",err.message);
        }
        //if regitering is successfull
        res.send(`Signed Up Successfullt, now <a href="/auth/login">Login</a>`)
    });
};

//check if user with credentials exists
const checkUser=(emailOrPhone,password,req,res)=>{
    const sql = `SELECT * FROM users WHERE (email = ? OR phone = ?) AND password = ?`;
    const params = [emailOrPhone, emailOrPhone, password];
    db.get(sql,params,(err,row)=>{
        if(err){
            console.log(`Login Error : ${err.message}`);
            return res.send(`Error while Logging In`);
        }

        //user with credentials not found
        if(!row){
            return res.send(`Invalid Credentials! do you want to <a href="/auth/signup">Signup?</a>`)
        }

        //set session
        req.session.user= {id:row.id,name:row.name,email:row.email};

        //login success
        res.send(`Login Successfull , Welcome ${row.name}`);
    });
};

//GET requests

//signup page
router.get('/signup', (req, res) => {
    //if user not logged in
    if(!req.session.user){
        res.sendFile(path.join(__dirname,"..","views","signup.html"));
    }
    else{
        //if logged in , go to home page
        res.redirect('/');
    }
    
});

//login page
router.get('/login', (req, res) => {
    //if user not logged in
    if(!req.session.user){
        res.sendFile(path.join(__dirname,"..","views","login.html"))
    }else{
        //if logged in , go to home page
        res.redirect('/');
    }
  
});


//POST REQUESTS

//signup
router.post('/signup', (req, res) => {
    const { name,email,phone,password } = req.body;
    //check if any data is missing
    if (!name || !email || !phone || !password) {return res.status(400).send('Name, email,phone and password are required');}
    //add to database
    addUserToDb(name,email,phone,password,res);
});


//login
router.post('/login', (req, res) => {
    const { emailOrPhone, password } = req.body;
    checkUser(emailOrPhone,password,req,res)
});


module.exports = router; //export router module
