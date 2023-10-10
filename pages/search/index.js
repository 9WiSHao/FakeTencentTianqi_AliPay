import { getCityCode, getHotCity } from '../../utils/myrequest';
import { dedupeNames } from '../../utils/conversion';
import { debounce } from '../../utils/debounce';
import { addCityRecord } from '../../utils/stroge';

Page({
	data: {
		cityCode: '',
		hotCity: [{ name: '北京', code: '101010100', fullName: '北京' }],
		searchCity: [],
		cityRecord: [],

		inputValue: '', // 输入框的值
		isFocused: false, // 输入框是否获得焦点
		isLoading: false, // 是否正在加载数据
		showResult: false, // 显示搜索记录时
		notfound: false, // 未找到的情况
	},
	async onLoad() {
		// 给输入框监听内容变化的函数加个防抖
		this.debouncedHandleInput = debounce(this.handleInput, 300);

		const hotCityJson = await getHotCity();
		const hotCityFullNameList = dedupeNames(hotCityJson.topCityList);

		let hotCity1 = [];
		hotCityJson.topCityList.forEach((item, index) => {
			hotCity1[index] = {
				name: item.name,
				code: item.id,
				fullName: hotCityFullNameList[index],
			};
		});
		const historyList = my.getStorageSync({ key: 'cityRecords' }).data || [];
		this.setData({
			hotCity: hotCity1,
			cityRecord: historyList,
		});
	},
	onTapCity(e) {
		const cityName = e.target.dataset.fullName;
		const cityCode = e.target.dataset.cityCode;
		addCityRecord(cityCode, cityName);
		const historyList = my.getStorageSync({ key: 'cityRecords' }).data || [];
		this.setData({
			cityRecord: historyList,
		});
		my.navigateTo({
			url: `/pages/index/index?cityName=${cityName}&cityCode=${cityCode}`,
		});
	},
	handleFocus() {
		this.setData({
			isFocused: true,
		});
	},
	handleBlur() {
		this.setData({
			isFocused: false,
			notfound: false,
		});
	},
	async handleInput(e) {
		if (!e.detail.value) {
			return;
		}

		this.setData({
			isLoading: true,
			inputValue: e.detail.value,
			notfound: false,
		});
		const res = await getCityCode(e.detail.value);
		if (res.code == '404') {
			this.setData({
				notfound: true,
				isLoading: false,
				searchCity: [],
			});
			return;
		}

		let cityList = [];
		const fullNameList = dedupeNames(res.location);
		res.location.forEach((item, index) => {
			cityList[index] = {
				code: item.id,
				fullName: fullNameList[index],
			};
		});
		this.setData({
			isLoading: false,
			showResult: true,
			searchCity: cityList,
		});
	},
	handleCancel() {
		this.setData({
			isLoading: false,
			showResult: false,
			isFocused: false,
			notfound: false,
			/**
			 * 这里大坑之，控制input框置空
			 * 总而言之就是需要现在onInput里，把每次的值给赋值给inputValue
			 * 然后别的地方给inputValue置空才有效
			 * 我不知道怎么想的，弱智语法，这玩意都不能双向绑定
			 */
			inputValue: '',
		});
	},
	deletSearchHistory() {
		my.setStorageSync({ key: 'cityRecords', data: [] });
		this.setData({
			cityRecord: [],
		});
	},
});
