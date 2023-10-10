export function debounce(func, wait) {
	let timeout;
	return function () {
		let context = this,
			args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func.apply(context, args);
		}, wait);
	};
}
