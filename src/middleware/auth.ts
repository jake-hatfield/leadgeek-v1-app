// packages
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// env
const jwtSecret = process.env.REACT_APP_JWT_SECRET;

export default function (req: Request, res: Response, next: NextFunction) {
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
				req.body.user = decoded.user;
				next();
			}
		});
	} catch (error) {
		console.error('something wrong with auth middleware');
		res.status(500).json({ message: 'Server Error' });
	}
}
