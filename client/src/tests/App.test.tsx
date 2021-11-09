// packages
import { shallow } from 'enzyme';

// components
import App from '../App';

// utils
import { findByTestAttribute } from './utils';

const setup = () => {
	return shallow(<App />);
};
test('renders a non-empty component ', () => {
	const wrapper = setup();
	const appComponent = findByTestAttribute(wrapper, 'component-app');
	expect(appComponent.length).toBe(1);
});
