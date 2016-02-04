let flattenArray = (data) => {
	if ((data === null) || (typeof data === 'undefined')) {
		return [];
	}

	if (Array.isArray(data)) {
		return data.reduce((out, item) => {
			return out.concat(flattenArray(item));
		}, []);
	} else {
		return [data];
	}
};

export default flattenArray;