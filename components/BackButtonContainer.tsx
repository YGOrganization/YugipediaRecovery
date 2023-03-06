import { PreviousPageContext } from 'lib/PageContext';
import useLinkTo from 'lib/useLinkTo';
import { useContext } from 'react';

export default function BackButtonContainer() {
	const PreviousPage = useContext(PreviousPageContext);

	return (
		<p>
			<button onClick={useLinkTo(PreviousPage)}>
				Back
			</button>
		</p>
	);
}
