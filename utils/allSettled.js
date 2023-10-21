// 为了兼容写的allSettled
export function allSettled(promises) {
	return Promise.all(
		promises.map((p) => {
			return p
				.then((value) => ({
					status: 'fulfilled',
					value,
				}))
				.catch((reason) => ({
					status: 'rejected',
					reason,
				}));
		})
	);
}
