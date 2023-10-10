export function setIconSrc(weather, time) {
	if (time == 'day') {
		switch (weather) {
			case '晴':
				return '/images/day/qing.png';
			case '阴':
				return '/images/day/yin.png';
			case '雨':
			case '小雨':
			case '中雨':
			case '大雨':
			case '暴雨':
			case '大暴雨':
			case '特大暴雨':
			case '阵雨':
			case '极端降雨':
				return '/images/day/yu.png';
			case '雷阵雨':
				return '/images/thunderstorms.svg';
			case '多云':
				return '/images/day/yun.png';
			default:
				return '/images/unknow.png';
		}
	}
	if (time == 'night') {
		switch (weather) {
			case '晴':
				return '/images/night/qing.png';
			case '阴':
				return '/images/night/yin.png';
			case '雨':
			case '小雨':
			case '中雨':
			case '大雨':
			case '暴雨':
			case '大暴雨':
			case '特大暴雨':
			case '阵雨':
			case '极端降雨':
				return '/images/night/yu.png';
			case '雷阵雨':
				return '/images/thunderstorms.svg';
			case '多云':
				return '/images/night/yun.png';
			default:
				return '/images/unknow.png';
		}
	}
	if (time == 'sunset') {
		return '/images/set.png';
	}
	if (time == 'sunrise') {
		return '/images/rise.png';
	}
}

export function deleteDuplicate(a, b) {
	if (a == b) {
		return a;
	}
	return `${a}转${b}`;
}

export function setDayOfWeek(date) {
	let now = new Date().getDate();
	let day = new Date(date).getDate();
	let minus = day - now;
	if (minus <= 2) {
		switch (minus) {
			case -1:
				return '昨天';
			case 0:
				return '今天';
			case 1:
				return '明天';
			case 2:
				return '后天';
		}
	}
	switch (new Date(date).getDay()) {
		case 0:
			return '周日';
		case 1:
			return '周一';
		case 2:
			return '周二';
		case 3:
			return '周三';
		case 4:
			return '周四';
		case 5:
			return '周五';
		case 6:
			return '周六';
	}
}

// 这是用来把日出日落插入进24小时天气的函数
export function get24hJson(json, sunrise1, sunset1, sunrise2, sunset2) {
	// 换成深拷贝。之前直接赋值的，才发现是浅拷贝，有bug
	let resultJson = JSON.parse(JSON.stringify(json));
	// 这是判断日出日落是否应该插到第二天（就是0点过后）的布尔值
	let day2 = false;
	let night2 = false;

	// 这一大串是获取应该用的日出日落时间（因为接口只能从7天天气预报那搞到两天的，只能自行判断）
	let sunriseTime1 = parseInt(sunrise1.split(':')[0]);
	let sunsetTime1 = parseInt(sunset1.split(':')[0]);

	let realSunrise = sunrise1;
	let realSunset = sunset1;

	if (sunriseTime1 < parseInt(resultJson.hourly[0].fxTime.split('T')[1].split(':')[0])) {
		realSunrise = sunrise2;
		day2 = true;
	}
	if (sunsetTime1 < parseInt(resultJson.hourly[0].fxTime.split('T')[1].split(':')[0])) {
		realSunset = sunset2;
		night2 = true;
	}

	// 这是如果判断是得插第二天，就先获取第二天从数组里哪一号开始
	let h24Index = 0;
	if (day2 || night2) {
		for (let i = 0; i < resultJson.hourly.length; i++) {
			if (resultJson.hourly[i].fxTime.split('T')[1].split(':')[0] == '00') {
				h24Index = i;
				break;
			}
		}
	}

	let sunriseHour = parseInt(realSunrise.split(':')[0]);
	let sunsetHour = parseInt(realSunset.split(':')[0]);

	// 这是获取日出要插哪
	let sunriseIndex = 0;
	let i = 0;
	if (day2) {
		i = h24Index;
	}
	while (i < resultJson.hourly.length) {
		if (sunriseHour < parseInt(resultJson.hourly[i].fxTime.split('T')[1].split(':')[0])) {
			sunriseIndex = i;
			break;
		}
		i++;
	}

	resultJson.hourly.splice(sunriseIndex, 0, { fxTime: `2023-06-23T${realSunrise}+08:00`, text: 'sunrise' });

	// 这是获取日落要插哪
	let sunsetIndex = 0;
	i = 0;
	if (night2) {
		i = h24Index;
	}
	while (i < resultJson.hourly.length) {
		if (sunsetHour < parseInt(resultJson.hourly[i].fxTime.split('T')[1].split(':')[0])) {
			sunsetIndex = i;
			break;
		}
		i++;
	}

	resultJson.hourly.splice(sunsetIndex, 0, { fxTime: `2023-06-23T${realSunset}+08:00`, text: 'sunset' });

	return resultJson;
}

export function airColor(aqi) {
	switch (aqi) {
		case '1':
			return '#a3d765';
		case '2':
			return '#f0cc35';
		case '3':
			return '#f1ab62';
		case '4':
			return '#ef7f77';
		case '5':
			return '#99004c';
		case '6':
			return '#7e0023';
		default:
			return 'black';
	}
}

export function dedupeNames(cityList) {
	let resultCityList = [];
	cityList.forEach((item, index) => {
		// 传过来的名字有重复，根据情况去除下重复
		let adm2 = item.adm2;
		if (item.adm2.substring(item.adm2.length - 1) != '市' && item.country == '中国') {
			adm2 = adm2 + '市';
		}
		let fullName = `${item.adm1} ${adm2} ${item.name}`;
		if (item.adm1 == adm2 || item.adm2 == item.name) {
			fullName = `${item.adm1} ${item.name}`;
			if (item.adm1 == item.name + '市') {
				fullName = item.name;
			}
		}

		resultCityList[index] = fullName;
	});
	return resultCityList;
}
