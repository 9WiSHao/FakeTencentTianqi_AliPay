import { getCityInformation } from '../../../../utils/myrequest';
import { API } from '../../../../utils/apis';

function processData(json) {
	let indices1Temp = [],
		indices2Temp = [];
	for (let i = 0; i < 8; i++) {
		let nameClass1 = json.daily[i].name.length > 6 ? 'active marquee-text' : 'active';
		indices1Temp[i] = {
			dataName: json.daily[i].name,
			dataText: json.daily[i].text,
			iconSrc: `/images/indices/${i + 1}.png`,
			suggest: json.daily[i].category,
			nameClass: nameClass1,
			indicesName: json.daily[i].name,
		};
		let nameClass2 = json.daily[i + 8].name.length > 6 ? 'active marquee-text' : 'active';
		indices2Temp[i] = {
			dataName: json.daily[i + 8].name,
			dataText: json.daily[i + 8].text,
			iconSrc: `/images/indices/${i + 9}.png`,
			suggest: json.daily[i + 8].category,
			nameClass: nameClass2,
			indicesName: json.daily[i + 8].name,
		};
	}

	return {
		indices1Temp,
		indices2Temp,
	};
}

Component({
	options: {
		// 使用基础库内置的数据变化观测器
		observers: true,
	},
	props: {
		cityCode: '101044000',
		onShowSuggestDialog: null,
	},
	data: {
		indices1: [
			{
				dataName: '运动指数',
				dataText: '阴天，较适宜进行各种户内外运动。',
				iconSrc: '/images/indices/1.png',
				suggest: '较适宜',
				nameClass: 'active',
				indicesName: '运动指数',
			},
		],
		indices2: [
			{
				dataName: '运动指数',
				dataText: '阴天，较适宜进行各种户内外运动。',
				iconSrc: '/images/indices/1.png',
				suggest: '较适宜',
				nameClass: 'active',
				indicesName: '运动指数',
			},
		],
	},
	async onInit() {
		const json = await getCityInformation(API.indices1d_1, this.props.cityCode);
		const { indices1Temp, indices2Temp } = processData(json);
		this.setData({
			indices1: indices1Temp,
			indices2: indices2Temp,
		});
	},
	observers: {
		cityCode: async function (newCityCode) {
			const json = await getCityInformation(API.indices1d_1, newCityCode);
			const { indices1Temp, indices2Temp } = processData(json);
			this.setData({
				indices1: indices1Temp,
				indices2: indices2Temp,
			});
		},
	},
	methods: {
		handleTap(event) {
			const data = { text: event.target.dataset.text, name: event.target.dataset.name, color: '#DFC79C' };
			this.props.onShowSuggestDialog({ data });
		},
	},
});
