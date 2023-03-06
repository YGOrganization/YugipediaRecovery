import CacheScanner from 'components/pages/CacheScanner';
import FAQ from 'components/pages/FAQ';
import useLinkTo from 'lib/useLinkTo';

export default function Home() {
	return (
		<main>
			<h1>Yugipedia Recovery</h1>
			<p>
				Yugipedia suffered from a catastrophic data loss, and needs your help getting some of the data back.
			</p>
			<div>
				<button className="big" onClick={useLinkTo(FAQ)}>
					What happened?
				</button>
				<button className="big primary" onClick={useLinkTo(CacheScanner)}>
					How can I help?
				</button>
			</div>
		</main>
	);
}
