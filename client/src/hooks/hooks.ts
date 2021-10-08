import { useEffect, useState, useCallback } from 'react';

// redux
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import type { RootState, AppDispatch } from '../store';

// redux hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// dark mode
export const useDarkMode = (): [
	'light' | 'dark',
	React.Dispatch<React.SetStateAction<string>>
] => {
	const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

	// return a new theme that's the opposite of the current theme
	const colorTheme = theme === 'light' ? 'dark' : 'light';

	useEffect(() => {
		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) &&
				window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [theme, colorTheme]);

	return [colorTheme, setTheme];
};

// right click context menu
export const useContextMenu = () => {
	const [xPos, setXPos] = useState('0px');
	const [yPos, setYPos] = useState('0px');
	const [showMenu, setShowMenu] = useState(false);

	const handleContextMenu = useCallback(
		(e) => {
			e.preventDefault();

			setXPos(`${e.pageX}px`);
			setYPos(`${e.pageY}px`);
			setShowMenu(true);
		},
		[setXPos, setYPos]
	);

	const handleClick = useCallback(() => {
		showMenu && setShowMenu(false);
	}, [showMenu]);

	useEffect(() => {
		document.addEventListener('click', handleClick);
		document.addEventListener('contextmenu', handleContextMenu);
		return () => {
			document.addEventListener('click', handleClick);
			document.removeEventListener('contextmenu', handleContextMenu);
		};
	});

	return { xPos, yPos, showMenu };
};
