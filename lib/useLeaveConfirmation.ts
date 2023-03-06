import { useEffect } from 'react';

/** A React hook which asks the user for confirmation to leave the page if there are unsaved changes. */
const useLeaveConfirmation = (unsavedChanges = true) => {
	useEffect(() => {
		if (!unsavedChanges) {
			return;
		}

		const onBeforeUnload = (event: BeforeUnloadEvent) => {
			event.preventDefault();
			return event.returnValue = '';
		};

		window.addEventListener('beforeunload', onBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', onBeforeUnload);
		};
	}, [unsavedChanges]);
};

export default useLeaveConfirmation;
