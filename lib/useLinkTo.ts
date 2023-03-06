import { usePage } from 'lib/PageContext';
import useFunction from 'lib/useFunction';

/** Returns a click event handler that links to the specified component, which must return a `main` element. */
export default function useLinkTo(Component: () => JSX.Element) {
	const [, setPage] = usePage();

	return useFunction(() => {
		setPage(() => Component);
	});
}
