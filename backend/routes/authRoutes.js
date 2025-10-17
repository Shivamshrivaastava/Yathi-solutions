const express = require('expresss');
const jwt =  require('jsonwebtoken');
const {body, validationResult } = require('express-validator');
const User  =  require("../models/User");

const router = express.router();

const signInToken = (user) =>{
    jwt.sign({id : user_id, role : user.role}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_IN||'7d'
    });

    router.post('/register', async(req, res) =>{
        try {
            const {name , email, password} = req.body;
            if(!name || !email || !password) {
                return res.status(400).json({message : "all fields are required"});
            }
            const existingUser = await user.findOne({email});
            if(existingUser){
                return res.status(409).json({message : 'Email already registered'});
            }
        } catch (error) {
            
        }
    }
    
}