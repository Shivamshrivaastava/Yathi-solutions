const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protected = async(req, res, next) => {
	try {
		let token = null;
		if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
			token = req.headers.authorization.split(' ')[1];
		}
		if(!token) {
			return res.status(404).json({message : "Not authorized"});

		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(decoded.id).select('-passsword');
		if(!req.user) {
			return res.status(401).json({message : "user not found"});
			next();
		}
	} catch (error) {
		return res.status(401).json({message : "unauthorized"});
	}
};

const requireRole = (role) => (req, res, next) => {
	if(!req.user || req.user.role !== role){
		return res.status(403).json({message : "Forbiddien :  insufficient permission"});

	}
	next();


};

module.exports = {protected, requireRole}
