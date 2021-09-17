import { useEffect, useState } from 'react';

const useDarkMode = (): (
	| string
	| React.Dispatch<React.SetStateAction<string>>
)[] => {
	const [theme, setTheme] = useState('light');
	// return a new theme that's the opposite of the current theme
	const colorTheme = theme === 'light' ? 'dark' : 'light';

	console.log(localStorage.theme);

	useEffect(() => {
		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) &&
				window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			console.log('Dark theme!');
			document.documentElement.classList.add('dark');
		} else {
			console.log('Light theme!');
			document.documentElement.classList.remove('dark');
		}
	}, [theme, colorTheme]);
	return [colorTheme, setTheme];
};

export default useDarkMode;
