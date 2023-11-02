// const qweatherKey = 'f066f70d77f049808a3c858fdb869ff3';
const qweatherKey = 'b22686b21992475d85606e9400778122';

// export const tencentLocationKey = 'TZBBZ-EN2CB-PEVU5-JOQ7F-DMMX2-UZBFJ';
// export const getLocation = 'https://apis.map.qq.com/ws/location/v1/ip';
// 估计小程序是用不了JSONP，调支付宝api获取位置吧
const getCityCode = 'https://geoapi.qweather.com/v2/city/lookup';
const getHotCity = 'https://geoapi.qweather.com/v2/city/top';
const getCityWeatherNow = 'https://devapi.qweather.com/v7/weather/now';
const getCityWeather7d = 'https://devapi.qweather.com/v7/weather/7d';
const getCityWeather24h = 'https://devapi.qweather.com/v7/weather/24h';
const getCitySunriseSunset = 'https://devapi.qweather.com/v7/astronomy/sun';
const getIndices1d_1 = 'https://devapi.qweather.com/v7/indices/1d';
const getCityAir = 'https://devapi.qweather.com/v7/air/now';
const getCityWarning = 'https://devapi.qweather.com/v7/warning/now';

export const API = {
	city: `${getCityCode}?key=${qweatherKey}`,
	hotCity: `${getHotCity}?key=${qweatherKey}&range=cn`,
	weatherNow: `${getCityWeatherNow}?key=${qweatherKey}`,
	weather7d: `${getCityWeather7d}?key=${qweatherKey}`,
	weather24h: `${getCityWeather24h}?key=${qweatherKey}`,
	sunriseSunset: `${getCitySunriseSunset}?key=${qweatherKey}`,
	indices1d_1: `${getIndices1d_1}?key=${qweatherKey}&type=0`,
	air: `${getCityAir}?key=${qweatherKey}`,
	warning: `${getCityWarning}?key=${qweatherKey}`,
	// 本来以为腾讯位置的api能用fetch方法获取，但是发现只能用JSONP，弃用了
	// location: `${getLocation}?key=${tencentLocationKey}`,
};
