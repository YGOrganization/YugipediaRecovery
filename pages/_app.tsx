import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.scss';

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Yugipedia Recovery</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/recover/favicon.ico" />
			</Head>

			<Component {...pageProps} />
		</>
	);
}
