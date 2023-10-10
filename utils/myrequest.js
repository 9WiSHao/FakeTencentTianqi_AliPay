import { API } from './apis';

export function getCityInformation(api, cityData) {
	return new Promise((resolve, reject) => {
		my.request({
			url: `${api}&location=${cityData}`,
			method: 'GET',
			dataType: 'json',
			timeout: 30000,
			success: (res) => {
				if (res.status === 200) {
					resolve(res.data);
				} else {
					reject('请求失败');
				}
			},
			fail: (err) => {
				reject(err);
			},
		});
	});
}

export function getCityCode(cityName) {
	return new Promise((resolve, reject) => {
		my.request({
			url: `${API.city}&location=${cityData}`,
			method: 'GET',
			dataType: 'json',
			timeout: 30000,
			success: (res) => {
				if (res.status === 200) {
					resolve(res.data);
				} else {
					reject('请求失败');
				}
			},
			fail: (err) => {
				reject(err);
			},
		});
	});
}

export function getHotCity() {
	return new Promise((resolve, reject) => {
		my.request({
			url: `${API.hotCity}&number=12`,
			method: 'GET',
			dataType: 'json',
			timeout: 30000,
			success: (res) => {
				if (res.status === 200) {
					resolve(res.data);
				} else {
					reject('请求失败');
				}
			},
			fail: (err) => {
				reject(err);
			},
		});
	});
}
