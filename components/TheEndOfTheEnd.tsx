import Home from 'components/pages/Home';
import useLinkTo from 'lib/useLinkTo';

export default function TheEndOfTheEnd() {
	return (
		<>
			<p>
				You may now close this tab.
			</p>
			<p>
				<button onClick={useLinkTo(Home)}>
					Back to Start
				</button>
			</p>
		</>
	);
}
