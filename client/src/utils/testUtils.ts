import React from 'react';
import { ShallowWrapper } from 'enzyme';
import store from 'store';

import * as ReactReduxHooks from '@hooks/hooks';

// find an element by data-test attribute
export const findByTestAttribute = (
	wrapper: ShallowWrapper<React.FC>,
	val: string
) => {
	return wrapper.find(`[data-test='${val}']`);
};

export const mockUseDispatch = () => {
	jest
		.spyOn(ReactReduxHooks, 'useAppDispatch')
		.mockImplementation(() => store.dispatch);
};

export const mockUseSelector = () => {
	jest
		.spyOn(ReactReduxHooks, 'useAppSelector')
		.mockImplementation(() => store.dispatch);
};

export const mockUseEffect = () => {
	const useEffect = jest.spyOn(React, 'useEffect');
	useEffect.mockImplementationOnce((f) => f());
};
