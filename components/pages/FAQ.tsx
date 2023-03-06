import BackButtonContainer from 'components/BackButtonContainer';
import CacheScanner from 'components/pages/CacheScanner';
import useLinkTo from 'lib/useLinkTo';

export default function FAQ() {
	return (
		<main id="faq" style={{ maxWidth: '850px' }}>
			<h1>FAQ</h1>

			<h2>What data was lost?</h2>
			<ul>
				<li>Bullet point 1</li>
				<li>Bullet point 2</li>
			</ul>

			<h2>What happened?</h2>
			<p>
				Example paragraph
			</p>

			<h2>When will the site be back?</h2>
			<p>
				More text here
			</p>

			<p>
				<button className="big primary" onClick={useLinkTo(CacheScanner)}>
					How can I help?
				</button>
			</p>

			<BackButtonContainer />
		</main>
	);
}
