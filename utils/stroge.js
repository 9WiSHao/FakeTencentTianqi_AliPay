export function addCityRecord(cityCode, cityName) {
	// 获取现有的城市记录数组
	const existingRecords = my.getStorageSync({ key: 'cityRecords' }).data || [];

	// 如果有重复搜索历史就移除
	const index = existingRecords.findIndex((record) => record.cityCode === cityCode);
	if (index !== -1) {
		existingRecords.splice(index, 1);
	}

	// 加入新历史记录
	existingRecords.unshift({ fullName: cityName, cityCode: cityCode });

	// 数组长度限制到12，也就是最多12条历史记录
	while (existingRecords.length > 12) {
		existingRecords.pop();
	}

	my.setStorageSync({ key: 'cityRecords', data: existingRecords });
}
