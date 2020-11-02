const plugin = require('tailwindcss/plugin');

module.exports = {
	future: {
		removeDeprecatedGapUtilities: true,
		// purgeLayersByDefault: true,
	},
	purge: false,
	theme: {
		extend: {
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
			},
			colors: {
				purple: {
					100: '#E6E6FF',
					200: '#C4C6FF',
					300: '#A2A5FC',
					400: '#8888FC',
					500: '#7069FA',
					600: '#5D55FA',
					700: '#4D3DF7',
					800: '#3525E6',
					900: '#1D0EBE',
				},
				teal: {
					100: '#EFFCF6',
					200: '#C6F7E2',
					300: '#8EEDC7',
					400: '#65D6AD',
					500: '#3EBD93',
					600: '#27AB83',
					700: '#199473',
					800: '#147D64',
					900: '#0C6B58',
				},
				gray: {
					100: '#F0F4F8',
					200: '#D9E2EC',
					300: '#BCCCDC',
					400: '#9FB3C8',
					500: '#829AB1',
					600: '#627D98',
					700: '#486581',
					800: '#334E68',
					900: '#243B53',
				},
			},
		},
	},
	variants: {
		backgroundColor: [
			'responsive',
			'first',
			'last',
			'even',
			'odd',
			'hover',
			'focus',
		],
		margin: [
			'responsive',
			'first',
			'last',
			'even',
			'odd',
			'hover',
			'group-hover',
			'focus',
		],
		padding: [
			'responsive',
			'first',
			'last',
			'even',
			'odd',
			'hover',
			'group-hover',
			'focus',
		],
		borderStyle: [
			'responsive',
			'first',
			'last',
			'even',
			'odd',
			'hover',
			'group-hover',
			'focus',
		],
		flexDirection: ['responsive', 'first', 'last', 'even', 'odd'],
	},
	corePlugins: {
		container: false,
	},
	plugins: [
		plugin(function ({ addComponents }) {
			const container = {
				'.container': {
					width: '100%',
					marginLeft: 'auto',
					marginRight: 'auto',
					paddingLeft: '1rem',
					paddingRight: '1rem',
					'@screen sm': {
						maxWidth: '640px',
						paddingLeft: '1rem',
						paddingRight: '1rem',
					},
					'@screen md': {
						maxWidth: '1023px',
						paddingLeft: '1.25rem',
						paddingRight: '1.25rem',
					},
					'@screen lg': {
						maxWidth: '1139px',
						paddingLeft: '1.5rem',
						paddingRight: '1.5rem',
					},
					'@screen xl': {
						maxWidth: '1600px',
						paddingLeft: '2rem',
						paddingRight: '2rem',
					},
				},
			};
			addComponents(container);
		}),
		// require('@tailwindcss/custom-forms'),
	],
};
