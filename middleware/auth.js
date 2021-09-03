const jwt = require('jsonwebtoken');
const jwtSecret = process.env.REACT_APP_JWT_SECRET;

module.exports = function (req, res, next) {
	// get token from header
	const token = req.header('x-auth-token');

	// check if no token
	if (!token) {
		return res.status(401).json({
			message: 'No token, authorization denied',
		});
	}

	// verify token
	try {
		jwt.verify(token, jwtSecret, (error, decoded) => {
			if (error) {
				return res.status(401).json({ message: 'Token is not valid' });
			} else {
				req.user = decoded.user;
				next();
			}
		});
	} catch (error) {
		console.error('something wrong with auth middleware');
		res.status(500).json({ message: 'Server Error' });
	}
};
