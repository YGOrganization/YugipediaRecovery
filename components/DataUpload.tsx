import ProgressBar from 'components/ProgressBar';
import TheEndOfTheEnd from 'components/TheEndOfTheEnd';
import { useData } from 'lib/DataContext';
import useFunction from 'lib/useFunction';
import useLeaveConfirmation from 'lib/useLeaveConfirmation';
import { useState } from 'react';

const MAX_SIZE = 8_000_000;

export default function DataUpload() {
	const [status, setStatus] = useState<'confirm' | 'uploading'>('confirm');
	const [error, setError] = useState<unknown>();

	const [done, setDone] = useState(0);
	const [total, setTotal] = useState(1);

	useLeaveConfirmation(done !== total);

	const data = useData();

	const tryToFetch = useFunction(() => {
		const firstPart = { ...data };
		const parts = [{
			object: firstPart,
			string: JSON.stringify(firstPart)
		}];

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];

			while (part.string.length > MAX_SIZE) {
				const keys = Object.keys(part.object);

				if (keys.length === 1) {
					break;
				}

				const newPart: typeof part = {
					object: {},
					string: ''
				};
				const keysHalfLength = keys.length / 2;

				for (let j = 0; j < keysHalfLength; j++) {
					const key = keys[j];

					newPart.object[key] = part.object[key];
					delete part.object[key];
				}

				part.string = JSON.stringify(part.object)
				newPart.string = JSON.stringify(newPart.object);

				parts.push(newPart);
			}
		}

		setTotal(parts.length);

		const upload = async () => {
			for (const part of parts) {
				await fetch('/recover/api/data', {
					method: 'POST',
					body: part.string,
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(response => {
					if (!response.ok) {
						throw Error(`${response.status} ${response.statusText}\n${response.text()}`);
					}

					setDone(done => done + 1);
				});
			}
		};

		upload().catch((error: unknown) => {
			setError(error);
		});
	});

	const upload = useFunction(() => {
		setStatus('uploading');
		setDone(0);
		tryToFetch();
	});

	const retry = useFunction(() => {
		setError(undefined);

		upload();
	});

	if (done === total) {
		return (
			<main>
				<h2>Thank you!</h2>
				<p>
					Thank you so much for helping.
				</p>
				<p>
					If you've used Yugipedia on other devices, browsers, or browser profiles, you can use this tool there as well!
				</p>
				<TheEndOfTheEnd />
			</main>
		);
	}

	const getContent = () => {
		if (error) {
			return (
				<>
					<h1>Oops!</h1>
					<p>An error occurred:</p>
					<pre>{error.toString()}</pre>
					<p>
						<button className="primary" onClick={retry}>
							Retry
						</button>
					</p>
					<p>
						Check your network connection. If the issue persists after retrying, report this to Grant#2604 on Discord.
					</p>
				</>
			);
		}

		if (status === 'uploading') {
			return (
				<>
					<h1>Almost done...</h1>
					<p>Uploading... This may take some time if you had a lot of data, so please be patient!</p>
					<ProgressBar value={done / total} />
				</>
			);
		}

		return (
			<>
				<h1>Ready to upload?</h1>
				<button className="big primary" onClick={upload}>
					Go!
				</button>
				<p>
					Here are the exact Yugipedia pages whose contents will be sent:
				</p>
				<pre>{Object.keys(data).join('\n')}</pre>
			</>
		);
	};

	return (
		<main style={{ maxWidth: '800px' }}>
			{getContent()}
		</main>
	);
}
