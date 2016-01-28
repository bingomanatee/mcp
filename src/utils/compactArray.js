let compactArray = (data) => {
	if ((data === null) || (typeof data === 'undefined')) {
		return [];
	}

	if (!Array.isArray(data)) {
		return data.reduce((out, item) => {
			return out.concat(compactArray(item));
		}, []);
	} else {
		return [data];
	}
};