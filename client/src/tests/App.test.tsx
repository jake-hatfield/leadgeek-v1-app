import React from 'react';

// packages
import { shallow } from 'enzyme';

// components
import App from '../App';

// utils
import { findByTestAttribute } from '@utils/testUtils';

const setup = () => shallow(<App />);

test('renders a non-empty component', () => {
	const wrapper = setup();
	const appComponent = findByTestAttribute(wrapper, 'component-app');
	expect(appComponent.length).toBe(1);
});

test.todo('useEffect for checking local storage token runs once');

test.todo('stripe is initialized');
