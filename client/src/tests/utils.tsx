import React from 'react';
import { ShallowWrapper } from 'enzyme';

// find an element by data-test attribute
export const findByTestAttribute = (
	wrapper: ShallowWrapper<React.FC>,
	val: string
) => {
	return wrapper.find(`[data-test='${val}']`);
};
