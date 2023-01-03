const express  = require("express");
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const userSchema = require("../models/userSchema")
const {userRegister ,  loginUser ,getUsers} = require("../controller/userController")
const jwt = require("jsonwebtoken")

router.post("/register" , body('email').isEmail() , userRegister)

router.post("/login", loginUser )

router.get("/users" , getUsers)


module.exports = router;       