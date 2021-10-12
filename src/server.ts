// node
import path from 'path';

// packages
import express, { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';

// files
import connectDB from '@config/db';

Sentry.init({
	dsn: 'https://89b1c9784db640928e7384d0f8d91f8b@o975120.ingest.sentry.io/5931105',
	tracesSampleRate: 1.0,
});

const app = express();

// connect DB
connectDB();

// init middleware
app.use(express.json());

// define routes
app.use('/api/auth', require('@routes/api/auth'));
app.use('/api/leads', require('@routes/api/leads'));
app.use('/api/users', require('@routes/api/users'));

function redirectWWWTraffic(req: Request, res: Response, next: NextFunction) {
	if (req.headers.host.slice(0, 4) === 'www.') {
		var newHost = req.headers.host.slice(4);
		return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl);
	}
	next();
}

// serve static assets in production
if (process.env.NODE_ENV === 'production') {
	// force https
	app.use((req, res, next) => {
		if (req.header('x-forwarded-proto') !== 'https')
			res.redirect(`https://${req.header('host')}${req.url}`);
		else next();
	});
	// 301 www to non-www
	app.use(redirectWWWTraffic);
	// set static folder
	app.use(express.static(path.join(__dirname, './client/build')));
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, './client/build/index.html'));
	});
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
