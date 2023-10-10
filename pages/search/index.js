import { getCityCode, getHotCity } from '../../utils/myrequest';
import { dedupeNames } from '../../utils/conversion';

Page({
	data: {
		cityCode: '',
		hotCity: [{ name: '北京', code: '101010100', fullName: '北京' }],
		searchCity: [],

		inputValue: '', // 输入框的值
		isFocused: false, // 输入框是否获得焦点
		isLoading: false, // 是否正在加载数据
	},
	async onLoad() {
		const hotCityJson = await getHotCity();
		const hotCity1 = dedupeNames(hotCityJson);
		this.setData({
			hotCity: hotCity1,
		});
	},
	onTapHotCity(e) {
		const cityName = e.target.dataset.fullName;
		const cityCode = e.target.dataset.cityCode;
		my.navigateTo({
			url: `/pages/index/index?cityName=${cityName}&cityCode=${cityCode}`,
		});
	},
	handleFocus() {
		console.log('焦点');
		this.setData({
			isFocused: true,
		});
	},
	handleBlur() {
		console.log('失焦');
		this.setData({
			isFocused: false,
		});
	},
	handleInput(e) {
		console.log(e.detail.value);
	},
});
