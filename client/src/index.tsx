import React from 'react';
import ReactDOM from 'react-dom';

import TagManager from 'react-gtm-module';

import App from './App';

import '@assets/index.css';

if (process.env.NODE_ENV === 'production') {
	TagManager.initialize({ gtmId: 'GTM-M4FPRGJ' });
}

ReactDOM.render(<App />, document.getElementById('root'));
