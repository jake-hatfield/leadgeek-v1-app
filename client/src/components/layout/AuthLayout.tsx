import React, { Fragment } from 'react';

// redux
import { useAppSelector, useContextMenu } from '@hooks/hooks';
import Alert from '@components/features/alert/Alert';

// components
import Navbar from '@components/layout/navigation/Navbar';
import Spinner from '@components/utils/Spinner';

interface AuthLayoutProps {
	children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
	// auth state
	const status = useAppSelector((state) => state.auth.status);
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const user = useAppSelector((state) => state.auth.user);

	return (
		<Fragment>
			<Alert />
			{status === 'idle' && isAuthenticated && user ? (
				<div className='min-h-screen w-full relative cs-bg overflow-hidden'>
					<Navbar />
					<main className='h-full w-full '>{children}</main>
					{/* <ContextMenu menu={[{ title: 'hello' }]} /> */}
				</div>
			) : (
				<Spinner
					divWidth={null}
					center={true}
					spinnerWidth={null}
					margin={false}
					text={'Loading account...'}
				/>
			)}
		</Fragment>
	);
};

// interface ContextMenuProps {
// 	menu: { title: string }[];
// }

// const ContextMenu: React.FC<ContextMenuProps> = ({ menu }) => {
// 	const { xPos, yPos, showMenu } = useContextMenu();
// 	console.log(xPos, yPos);
// 	return showMenu && menu ? (
// 		<ul
// 			className='absolute card-padding cs-light-200 card-300'
// 			style={{
// 				top: yPos,
// 				left: xPos,
// 			}}
// 		>
// 			{menu.map((menuItem, i) => (
// 				<li>{menuItem.title}</li>
// 			))}
// 		</ul>
// 	) : (
// 		<></>
// 	);
// };

export default AuthLayout;
