import Data from 'lib/Data';
import { MAX_DATE_NUMBER, MIN_DATE_NUMBER } from 'lib/dates';

function addData(
	data: Data,
	dateNumber: number,
	pathname: string,
	value: string
) {
	if (dateNumber > MAX_DATE_NUMBER || dateNumber < MIN_DATE_NUMBER || !value) {
		return;
	}

	if (!data[pathname]) {
		data[pathname] = {};
	}

	const item = data[pathname]!;

	if (!item[value]) {
		item[value] = [];
	}

	if (!item[value]!.includes(dateNumber)) {
		item[value]!.push(dateNumber);
	}
}

export default addData;
