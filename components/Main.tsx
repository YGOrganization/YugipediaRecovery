import Home from 'components/pages/Home';
import Data from 'lib/Data';
import { DataContext } from 'lib/DataContext';
import PageContext, { PreviousPageContext } from 'lib/PageContext';
import { useMemo, useRef, useState } from 'react';

export default function Main() {
	const dataRef = useRef<Data>({});
	const data = dataRef.current;

	if (typeof window !== undefined) {
		Object.assign(window, { data });
	}

	const [Page, setPage] = useState(() => Home);
	const pageState = useMemo(() => (
		[Page, setPage] as const
	), [Page, setPage]);

	const pageRef = useRef(Page);
	const previousPagesRef = useRef<Array<() => JSX.Element>>([]);
	const previousPages = previousPagesRef.current;

	if (Page !== pageRef.current) {
		const pageIndex = previousPages.indexOf(Page);
		if (pageIndex === -1) {
			previousPages.push(pageRef.current);
		} else {
			previousPages.length = pageIndex;
		}

		pageRef.current = Page;
	}

	const PreviousPage = previousPages[previousPages.length - 1];

	return (
		<DataContext.Provider value={data}>
			<PageContext.Provider value={pageState}>
				<PreviousPageContext.Provider value={PreviousPage}>
					<Page />
				</PreviousPageContext.Provider>
			</PageContext.Provider>
		</DataContext.Provider>
	);
}
