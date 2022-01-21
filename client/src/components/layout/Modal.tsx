import React from 'react';

interface ModalState<T> {
	type: T;
	active: boolean;
	step: number;
}

interface ModalProps<T> {
	modal: ModalState<T>;
	setModal: React.Dispatch<React.SetStateAction<ModalState<T>>>;
	content: {
		title: JSX.Element;
		body: JSX.Element;
		action: JSX.Element;
	}[];
	isMultiStep: boolean;
}

const Modal: React.FC<ModalProps<any>> = ({
	modal,
	setModal,
	content,
	isMultiStep,
}) => {
	const displayMultiStepContent = (step: number, contentArr: any[]) => {
		return contentArr[step - 1];
	};

	const displayContent = (type: 'title' | 'body' | 'action'): JSX.Element => {
		return isMultiStep
			? displayMultiStepContent(modal.step, content)[type]
			: content;
	};

	return (
		<>
			<div
				onClick={() => {
					setModal((prevState) => ({
						...prevState,
						active: false,
						step: 1,
					}));
				}}
				className='absolute inset-0 z-10 h-full w-full bg-gray-900 opacity-25'
			/>
			<div
				className={`absolute top-1/4 inset-x-0 z-20 max-h-screen max-w-lg mx-auto pt-2 md:pt-4 lg:pt-6 cs-light-200 card-200`}
			>
				<div className='relative pb-1 border-b border-200'>
					<header className='card-padding-x'>
						<h3 className='text-xl font-bold text-300'>
							{displayContent('title')}
						</h3>
					</header>
					<button
						onClick={() =>
							setModal((prevState) => ({
								...prevState,
								active: false,
								step: 1,
							}))
						}
						className='absolute top-0 right-3 md:right-5 lg:right-7 ml-2 p-1 text-100 hover:bg-gray-100 dark:hover:bg-darkGray-100 rounded-md hover:text-gray-700 dark:hover:text-gray-400 ring-gray transition-main'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='svg-base'
							viewBox='0 0 20 20'
							fill='currentColor'
						>
							<path
								fillRule='evenodd'
								d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
								clipRule='evenodd'
							/>
						</svg>
					</button>
				</div>
				<div className='mt-4'>
					<div className='card-padding-x'>{displayContent('body')}</div>
					<div className='flex justify-end mt-4 py-2 card-padding-x cs-bg rounded-b-lg border-t border-300'>
						<div className='flex items-center'>{displayContent('action')}</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Modal;
