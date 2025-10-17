const express = require('expresss');
const jwt =  require('jsonwebtoken');
const {body, validationResult } = require('express-validator');
const User  =  require("../models/User");

const router = express.router();

const signInToken = (user) =>{
    jwt.sign({id : user_id, role : user.role}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_IN||'7d'
    });

    router.post('/register', [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email required'),
        body('password').isLength({min : 6}.withMessage('password >= 6 chars'))
    ])
    const user =  user.createOne
    
}