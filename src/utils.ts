import nodemailer from 'nodemailer';

const nodemailerEmail = process.env.REACT_APP_EMAIL_ADDRESS;
const nodemailerPassword = process.env.REACT_APP_EMAIL_PASSWORD;

const setMailTransport = () => {
	return nodemailer.createTransport({
		name: 'improvmx',
		host: 'smtp.improvmx.com',
		port: 465,
		secure: true,
		auth: {
			user: nodemailerEmail,
			pass: nodemailerPassword,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});
};

export const sendEmail = async (email: any) => {
	const transporter = setMailTransport();
	try {
		const info = await transporter.sendMail(email);
		await transporter.close();
		console.log(`Message sent ${info.messageId}`);
		return 1;
	} catch (error) {
		console.log(error);
		await transporter.close();
		return 0;
	}
};
