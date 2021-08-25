import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import App from './App';

import '@assets/index.css';

Sentry.init({
	dsn: 'https://89b1c9784db640928e7384d0f8d91f8b@o975120.ingest.sentry.io/5931105',
	integrations: [new Integrations.BrowserTracing()],

	tracesSampleRate: 1.0,
});

ReactDOM.render(<App />, document.getElementById('root'));
