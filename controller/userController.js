const express  = require("express");
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const userSchema = require("../models/userSchema")
const jwt = require("jsonwebtoken")




const userRegister = (req,res)=>{
    // checking wheather email format is correct or wrong
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {name,email,isAdmin,password,confirmPassword} = req.body;
    //checking the password
    if(password != confirmPassword){
        return res.send("Password not matched")
    }

  //for hasing the password
    var hashedPassword = bcrypt.hashSync(password, 10);

  //saving data in database
    const user = new userSchema({name , email, isAdmin, password:hashedPassword})
    user.save((err,user)=>{
        if(err){
            res.json(err)
        }else{
            res.json({message:"User Registred Succcuessfully" , user})
        }
    })
 }

 const loginUser = async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){    // if there is no email or no password
        if(!email){
            res.send("Enter Email")
        }else if(!password){
            res.send("Enter password")
        }
    }

    //checking entred email is there in our database
    const user = await userSchema.findOne({email: email}) 
    if(!user){
        return res.send(`No user found with this ${email}`)
    }

    //chacking enterd password is there in our database. entered password is comparing with hashed password

    const result = bcrypt.compareSync(password,user.password);
    if(result == false){
        return res.send("Incorrect Password")
    }

  const token =   jwt.sign({email:user.email , isAdmin: user.isAdmin},"shhhh")
  res.send(token)
}


const getUsers = (req,res)=>{
    var token = req.headers.authorization;
    if(!token){
        return res.send("Login Required")
    }


    try{
        const decoded = jwt.verify(token,"shhhh")
        if(decoded.isAdmin == false){
            return res.send("You are not a Admin")
        }
        userSchema.find({},(err,users)=>{
            if(err){
                res.send(err)
            }else{
                res.send(users)
            }
        })
    }catch(err){
        return res.send("Invalid Token")
    }
   
}

 module.exports = {userRegister, loginUser, getUsers}