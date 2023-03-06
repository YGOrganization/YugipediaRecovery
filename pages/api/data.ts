import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { Readable } from 'node:stream';
import { once } from 'node:events';
import { NextApiRequest, NextApiResponse } from 'next';
import { MAX_DATE_NUMBER, MIN_DATE_NUMBER } from 'lib/dates';
import PATHNAMES from 'lib/PATHNAMES';

const TARGET_DIRECTORY = '/mnt/google/recover';

export const config = {
	api: {
		bodyParser: {
			sizeLimit: '100mb'
		}
	}
};

const PATHNAME_SET = new Set(PATHNAMES);

const KEY = Buffer.from('v04LxJxFPP6DJTnU5ErBTQyXjUpvYmUy', 'base64');

const hash = (data: string) => (
	crypto.createHmac('sha256', KEY).update(data).digest().toString('base64url')
);

const isValidDate = (dateNumber: unknown) => (
	typeof dateNumber === 'number'
	&& !(dateNumber < MIN_DATE_NUMBER || dateNumber > MAX_DATE_NUMBER)
);

const isValidDates = (dates: unknown) => (
	Array.isArray(dates)
	&& dates.every(isValidDate)
);

const isValidEntry = ([key, value]: [string, unknown]) => (
	PATHNAME_SET.has(key)
	&& value instanceof Object
	&& Object.values(value).every(isValidDates)
);

const isValidBody = (body: unknown) => (
	body instanceof Object
	&& Object.entries(body).every(isValidEntry)
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'OPTIONS') {
		res.setHeader('Allow', 'OPTIONS, POST').end();
		return;
	}

	if (req.method !== 'POST') {
		res.status(405).end();
		return;
	}

	if (req.headers['content-type'] !== 'application/json') {
		res.status(415).end();
		return;
	}

	if (!isValidBody(req.body)) {
		res.status(400).end();
		return;
	}

	const date = new Date();
	const dateString = `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(-2)}-${`0${date.getDate()}`.slice(-2)}`;

	const parentPath = path.join(TARGET_DIRECTORY, dateString);
	await fs.promises.mkdir(parentPath, { recursive: true });

	const contentHash = hash(JSON.stringify(req.body));
	const filename = `${contentHash}.json.br`;
	const filePath = path.join(parentPath, filename);

	const bodyStream = Readable.from(
		JSON.stringify(req.body)
	);
	const brotliCompress = zlib.createBrotliCompress();
	const writeStream = fs.createWriteStream(filePath);

	bodyStream.pipe(brotliCompress).pipe(writeStream);

	await once(writeStream, 'close');
	res.end();
}
