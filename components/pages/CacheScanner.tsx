import BackButtonContainer from 'components/BackButtonContainer';
import TheEnd from 'components/pages/TheEnd';
import ProgressBar from 'components/ProgressBar';
import addData from 'lib/addData';
import { useData } from 'lib/DataContext';
import { MAX_DATE_NUMBER, MIN_DATE_NUMBER } from 'lib/dates';
import PATHNAMES from 'lib/PATHNAMES';
import timeOut from 'lib/timeOut';
import useFunction from 'lib/useFunction';
import useLeaveConfirmation from 'lib/useLeaveConfirmation';
import useLinkTo from 'lib/useLinkTo';
import { useRef, useState } from 'react';

const URL_PREFIX = 'https://yugipedia.com/wiki/';

const getURLString = (pathname: string) => 'https://yugipedia.com' + pathname;

export default function CacheScanner() {
	const data = useData();

	const [started, setStarted] = useState(false);
	const [done, setDone] = useState(0);

	useLeaveConfirmation(started);

	const pathnameIndexRef = useRef(0);

	const lastTimeoutRef = useRef(Date.now());

	const cacheModeRef = useRef<'only-if-cached' | 'force-cache'>();

	const setCacheMode = useFunction(() => (
		fetch(location.href, {
			cache: 'only-if-cached',
			mode: 'same-origin'
		}).then(() => {
			cacheModeRef.current = 'only-if-cached';
		}).catch(() => {
			cacheModeRef.current = 'force-cache';
		})
	));

	const fetchNext = useFunction(async () => {
		const pathname = PATHNAMES[pathnameIndexRef.current];

		if (pathname === undefined) {
			return;
		}

		pathnameIndexRef.current++;

		const urlString = getURLString(pathname);

		// The occasional timeout prevents the renderer from freezing.
		let timeout;
		const now = Date.now();
		if (lastTimeoutRef.current < now - 100) {
			timeout = timeOut();
			lastTimeoutRef.current = now;
		}

		const [response] = await Promise.all([
			fetch(urlString, {
				cache: cacheModeRef.current,
				mode: 'same-origin',
				headers: {
					'Yugipedia-Recover': '1'
				}
			}).catch(() => undefined),
			timeout
		]);

		setDone(done => done + 1);

		if (!response?.ok) {
			return;
		}

		const dateString = response.headers.get('Date');

		if (!dateString) {
			return;
		}

		const dateNumber = +new Date(dateString);

		if (!dateNumber || dateNumber < MIN_DATE_NUMBER || dateNumber > MAX_DATE_NUMBER) {
			return;
		}

		const text = await response.text();

		addData(data, dateNumber, pathname, text);

		const html = new DOMParser().parseFromString(text, 'text/html');

		for (const a of html.getElementsByTagName('a')) {
			if (!a.href.startsWith(URL_PREFIX)) {
				continue;
			}

			const aPathname = new URL(a.href).pathname;

			if (PATHNAMES.includes(aPathname)) {
				continue;
			}

			PATHNAMES.push(aPathname);
		}
	});

	const runFetchLoop = useFunction(async () => {
		while (PATHNAMES[pathnameIndexRef.current]) {
			await fetchNext();
		}
	});

	const start = useFunction(async () => {
		setStarted(true);

		if (!cacheModeRef.current) {
			await setCacheMode();
		}

		for (let i = 0; i < 2; i++) {
			runFetchLoop();
		}
	});

	const linkToNext = useLinkTo(TheEnd);

	const getContent = () => {
		if (!started) {
			return (
				<>
					<p>
						You can help right here in this website without downloading anything! This tool works on any device or platform.
					</p>
					<p>
						Click the button below to start scanning Yugipedia's cache in your browser for any lost data. This may take a while, so please be patient!
					</p>
					<button className="primary" onClick={start}>
						Start Cache Scan
					</button>
					<p>
						You'll be able to confirm all the data entries to be sent before anonymously sending them. This tool is also open-source; there's a link in the bottom-right corner, so feel free to confirm this yourself!
					</p>
					<BackButtonContainer />
				</>
			);
		}

		if (done === PATHNAMES.length) {
			return (
				<>
					<p>
						<b>Cache scan complete!</b> You can confirm uploading your data in the next step.
					</p>
					<button className="primary" onClick={linkToNext}>
						Next
					</button>
				</>
			);
		}

		return (
			<>
				<p>
					Scanning Yugipedia's cache in your browser... This may take a while, so please be patient!
				</p>
				<ul>
					<li>
						<b>If you're on desktop:</b> You're free to tab out while this loads (though it may load slower while tabbed out in some cases).
					</li>
					<li>
						<b>If you're on mobile:</b> Stay on this page and keep your screen awake!
					</li>
				</ul>
				<ProgressBar value={done / PATHNAMES.length} />
			</>
		)
	};

	return (
		<main>
			<h1>Yugipedia Recovery Tool</h1>
			{getContent()}
		</main>
	);
}
