import DataUpload from 'components/DataUpload';
import TheEndOfTheEnd from 'components/TheEndOfTheEnd';
import { useData } from 'lib/DataContext';

export default function TheEnd() {
	const data = useData();

	if (Object.values(data).length === 0) {
		return (
			<main>
				<h2>No data found!</h2>
				<p>
					Thank you so much for helping.
				</p>
				<p>
					We didn't find any useful data from your browser's cache, but if you've used Yugipedia on other devices, browsers, or browser profiles, you can use this tool there as well!
				</p>
				<TheEndOfTheEnd />
			</main>
		);
	}

	return <DataUpload />;
}
