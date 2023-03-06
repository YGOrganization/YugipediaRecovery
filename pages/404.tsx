import Router from 'next/router';
import { useEffect } from 'react';

export default function Component() {
	useEffect(() => {
		Router.replace('/');
	});

	return null;
}
