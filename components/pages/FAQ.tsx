import BackButtonContainer from 'components/BackButtonContainer';
import CacheScanner from 'components/pages/CacheScanner';
import useLinkTo from 'lib/useLinkTo';

export default function FAQ() {
	return (
		<main id="faq" style={{ maxWidth: '850px' }}>
			<h1>FAQ</h1>

			<h2>What happened, and how can I be sure it won't happen again?</h2>
			<p>
				While working on some server issues, one of our server people noticed a storage volume connected to the server that appeared extraneous. After performing some checks on whether the storage was in use, it appeared not to be. To save server costs, the storage volume was accordingly removed. Unfortunately, we later discovered the volume was not configured normally, so our prior checks couldn't detect that the volume actually was in use, and what we removed was the storage volume containing the site's primary database.
			</p>
			<p>
				We're rebuilding a more optimized server, which was the goal of our previous server work in the first place. It will be more adequately labeled, with backups kept on a completely different server and host.
			</p>

			<h2>Why weren't there more recent backups?</h2>
			<p>
				Our most recent backup is from January 12, 2020. As previously mentioned, the storage volume we lost appeared to be empty, so we thought there was no reason to create backups for it. We're deeply sorry that our oversight led to a lack of adequate backups and protecting the information that was lost.
			</p>

			<h2>When will the site be back?</h2>
			<p>
				The current situation is, the longer we wait to put the site online, the more we can recover, and we're confident a large portion of the data can be recovered! In order to recover that data most effectively, we're choosing to keep the site offline. We promise it will return as soon as possible. For more information, or if you have other questions, feel free to join <a href="https://discord.gg/e98zgyd" target="_blank" rel="noreferrer">our Discord server</a>. Updates on our progress are shared in the #announcements channel.
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
