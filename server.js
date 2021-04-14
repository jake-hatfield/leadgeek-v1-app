const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// connect DB
connectDB();

// init middleware
app.use(express.json({ extended: false }));

// define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/leads', require('./routes/api/leads'));
app.use('/api/search', require('./routes/api/search'));

function redirectWwwTraffic(req, res, next) {
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
	app.use(redirectWwwTraffic);
	// set static folder
	app.use(express.static(path.join(__dirname, './client/build')));
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, './client/build/index.html'));
	});
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
