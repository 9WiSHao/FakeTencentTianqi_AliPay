import { API } from '../../utils/apis.js';
import { getCityInformation } from '../../utils/myrequest.js';
import { deleteDuplicate, setIconSrc, setDayOfWeek, airColor, dedupeNames } from '../../utils/conversion.js';
import { allSettled } from '../../utils/allSettled.js';
// 为了兼容写的allSettled
import { authGuideLocation } from '../../utils/location.js';
import { getCityCode } from '../../utils/myrequest.js';

async function fetchWeatherData(cityCode) {
	// 获取数据
	const weatherNowPromise = getCityInformation(API.weatherNow, cityCode);
	const weather7dPromise = getCityInformation(API.weather7d, cityCode);
	const airQuality = getCityInformation(API.air, cityCode);
	// return await Promise.allSettled([weatherNowPromise, weather7dPromise]);
	// 我服了，手机上不支持Promise.allSettled，只能手动写个了，用Promise.all代替
	return await allSettled([weatherNowPromise, weather7dPromise, airQuality]);
}

function processWeatherData(results) {
	let nowData = {},
		_2dData = {},
		_7dData = {},
		sunTime = {},
		airQuality = {},
		airQualityDetail = {};
	// 主页今日天气数据处理
	if (results[0].status === 'fulfilled') {
		const json = results[0].value;
		nowData = {
			latestRelease: `和⻛天气 ${json.updateTime.split('T')[1].split('+')[0]}发布`,
			mainCityTemperature: `${json.now.temp}°`,
			mainWeatherText: json.now.text,
			mainHumidity: `湿度 ${json.now.humidity}%`,
			mainWind: `${json.now.windDir} ${json.now.windScale}级`,
			greeting: '问候语，没编出来',
		};
	} else {
		console.log('今日天气请求出错', results[0].reason);
	}

	// 7日天气数据获取（直接获取是因为主页只有今明两天，避免二次获取就此处获取再传过去）
	if (results[1].status === 'fulfilled') {
		const json = results[1].value;
		// 今明两日天气
		_2dData = {
			// 这么写是因为直接获取对象属性我配的eslint给我报错
			['weatherToday.temperature']: `${json.daily[0].tempMax}/${json.daily[0].tempMin}°`,
			['weatherToday.weather']: deleteDuplicate(json.daily[0].textDay, json.daily[0].textNight),
			['weatherToday.iconSrc']: setIconSrc(json.daily[0].textDay, 'day'),
			['weatherTomorrow.temperature']: `${json.daily[1].tempMax}/${json.daily[1].tempMin}°`,
			['weatherTomorrow.weather']: deleteDuplicate(json.daily[1].textDay, json.daily[1].textNight),
			['weatherTomorrow.iconSrc']: setIconSrc(json.daily[1].textDay, 'day'),
		};
		// 7日天气
		let day7dTemp = [],
			night7dTemp = [],
			temperature7dTemp = { max: [], min: [] };
		for (let i = 0; i < 7; i++) {
			day7dTemp[i] = {
				dayText: setDayOfWeek(json.daily[i].fxDate),
				dayDate: `${json.daily[i].fxDate.split('-')[1]}/${json.daily[i].fxDate.split('-')[2]}`,
				weather: json.daily[i].textDay,
				iconSrc: setIconSrc(json.daily[i].textDay, 'day'),
			};
			night7dTemp[i] = {
				iconSrc: setIconSrc(json.daily[i].textNight, 'night'),
				weather: json.daily[i].textNight,
				windDirection: json.daily[i].windDirNight,
				windPower: json.daily[i].windScaleNight,
			};
			temperature7dTemp.max[i] = parseInt(json.daily[i].tempMax);
			temperature7dTemp.min[i] = parseInt(json.daily[i].tempMin);
		}

		_7dData = { day7d: day7dTemp, night7d: night7dTemp, temperature7d: temperature7dTemp };

		sunTime = { sunrise1: json.daily[0].sunrise, sunset1: json.daily[0].sunset, sunrise2: json.daily[1].sunrise, sunset2: json.daily[1].sunset };
	} else {
		console.log('七日天气获取错误', results[1].reason);
	}
	// 处理空气质量数据
	if (results[2].status === 'fulfilled') {
		const json = results[2].value;
		// 简单的空气质量数据
		airQuality = {
			aqi: json.now.aqi,
			category: json.now.category,
			color: airColor(json.now.level),
		};
		// 空气质量弹窗详情数据
		const keys = Object.keys(json.now);
		let detail = [];
		for (let i = 0; i < 6; i++) {
			let title = keys[i + 5];
			if (title === 'pm2p5') {
				title = 'pm2.5';
			}
			detail.push({
				key: title.toUpperCase(),
				data: json.now[keys[i + 5]],
			});
		}
		airQualityDetail = {
			aqi: json.now.aqi,
			category: json.now.category,
			color: airColor(json.now.level),
			detail: detail,
		};
	} else {
		console.log('空气质量获取错误', results[2].reason);
	}
	return {
		nowData,
		_2dData,
		_7dData,
		sunTime,
		airQuality,
		airQualityDetail,
	};
}

Page({
	options: {
		// 使用基础库内置的数据变化观测器
		observers: true,
	},
	data: {
		// 所有组件发请求都要使用的城市代码
		cityCode: '101044000',
		// 弹窗相关数据
		maskExists: false,
		suggestDialogExists: false,
		suggestDialogText: '',
		suggestDialogAnimation: '',

		airQualityDialogExists: false,
		airQualityDialogAnimation: '',

		// 默认数据
		location: '重庆市 南岸区',
		latestRelease: '数据提供方 加载中',
		mainCityTemperature: '11°',
		mainWeatherText: '晴',
		mainHumidity: '45%',
		mainWind: '东南风 1级',
		greeting: '圣地巡礼',
		weatherToday: {
			temperature: '10/19°',
			weather: '晴转阴',
			iconSrc: '/images/day/qing.png',
		},
		weatherTomorrow: {
			temperature: '10/19°',
			weather: '晴转阴',
			iconSrc: '/images/day/qing.png',
		},
		// 这是后面会传给24h用的，因为需要加日出日落时间。不过这个数据在7天天气里
		sunTime: { sunrise1: '00:00', sunset1: '00:00', sunrise2: '00:00', sunset2: '00:00' },

		// 这是给7天天气用的数据，因为首页需要用，就提前获取了
		day7d: [
			{
				dayText: '今天',
				dayDate: '11/04',
				weather: '晴',
				iconSrc: '/images/day/qing.png',
			},
		],
		night7d: [
			{
				iconSrc: '/images/night/qing.png',
				weather: '晴',
				windDirection: '东南风',
				windPower: '2级',
			},
		],
		temperature7d: {
			max: [22, 12, 13, 14, 20, 16, 17],
			min: [1, 10, 3, 4, 10, 6, 7],
		},
		airQuality: {},
		airQualityDetail: {},
	},
	async onLoad(query) {
		if (query && query.cityCode) {
			this.setData({
				location: query.cityName,
				cityCode: query.cityCode,
			});
		} else {
			const results = await fetchWeatherData(this.data.cityCode);
			const { nowData, _2dData, _7dData, sunTime, airQuality, airQualityDetail } = processWeatherData(results);
			this.setData({
				...nowData,
				..._2dData,
				..._7dData,
				sunTime,
				airQuality,
				airQualityDetail,
			});
		}
	},
	onReady() {
		// 页面加载完成
	},
	async onShow() {
		try {
			// 获取位置信息相关
			const authRes = await authGuideLocation();
			if (authRes === true) {
				const locationRes = await new Promise((resolve, reject) => {
					my.getLocation({
						type: 1,
						success: (res) => resolve(res),
						fail: (error) => reject(error),
					});
				});
				// 用经纬获取所在位置，精准
				const cityCodeRes = await getCityCode(`${locationRes.longitude},${locationRes.latitude}`);
				this.setData({
					cityCode: cityCodeRes.location[0].id,
					location: dedupeNames(cityCodeRes.location)[0],
				});
			}
		} catch (error) {
			console.error('出现错误: ', JSON.stringify(error));
		}
	},
	onHide() {
		// 页面隐藏
	},
	onUnload() {
		// 页面被关闭
	},
	onTitleClick() {
		// 标题被点击
	},
	onPullDownRefresh() {
		// 页面被下拉
	},
	onReachBottom() {
		// 页面被拉到底部
	},
	onShareAppMessage() {
		// 返回自定义分享信息
		// return {
		// 	title: 'My App',
		// 	desc: 'My App description',
		// 	path: 'pages/index/index',
		// };
	},
	// 检测城市代码，如果变了就重新渲染
	observers: {
		cityCode: async function (newCityCode) {
			const results = await fetchWeatherData(newCityCode);
			const { nowData, _2dData, _7dData, sunTime, airQuality, airQualityDetail } = processWeatherData(results);
			this.setData({
				...nowData,
				..._2dData,
				..._7dData,
				sunTime,
				airQuality,
				airQualityDetail,
			});
		},
	},
	onGoToSearch() {
		my.navigateTo({
			url: '/pages/search/index',
		});
	},
	onShowMask() {
		this.setData({
			maskExists: true,
		});
	},
	onHiddenMask() {
		this.setData({
			maskExists: false,
		});
	},
	onShowSuggestDialog(suggestData) {
		this.setData({
			suggestDialogExists: true,
			suggestDialogData: suggestData.data,
			maskExists: true,
			suggestDialogAnimation: 'up',
		});
	},
	onHiddenSuggestDialog() {
		this.setData({
			suggestDialogText: '',
			suggestDialogAnimation: 'down',
		});
		// 因为设置v-if就类似直接设置display:none,直接没了，所以等消失动画走完再设置
		setTimeout(() => {
			this.setData({
				suggestDialogExists: false,
			});
		}, 300);
	},
	onShowAirQualityDialog() {
		this.setData({
			airQualityDialogExists: true,
			airQualityDialogAnimation: 'up',
			maskExists: true,
		});
	},
	onHiddenAirQualityDialog() {
		this.setData({
			airQualityDialogAnimation: 'down',
		});
		setTimeout(() => {
			this.setData({
				airQualityDialogExists: false,
			});
		}, 300);
	},
});
