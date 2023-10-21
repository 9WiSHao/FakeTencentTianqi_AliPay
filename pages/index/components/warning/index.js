import { getCityInformation } from '../../../../utils/myrequest';
import { API } from '../../../../utils/apis';

function processData(json) {
	let _warningExist = false,
		warningArr = [];
	if (json.warning.length === 0) {
		return {
			_warningExist,
			warningArr,
		};
	}
	_warningExist = true;
	json.warning.forEach((item) => {
		// 这个是给对话框顶色单独设置，去掉黄色情况，因为黄色底色真看不清白色的字
		let color2 = item.severityColor;
		if (color2 == 'Yellow') {
			color2 = '#f5d271';
		}
		warningArr.push({
			color: item.severityColor,
			type: `${item.typeName}预警`,
			dialogTitle: `${item.typeName}${item.level}预警`,
			dialogText: `${item.text}（预警信息来源：国家预警信息发布中心、${item.sender}）`,
			dialogColor: color2,
		});
	});
	return {
		_warningExist,
		warningArr,
	};
}

Component({
	options: {
		// 使用基础库内置的数据变化观测器
		observers: true,
	},
	props: {
		cityCode: '101310101',
	},
	data: {
		warningExist: true,
		warningArray: [],
	},
	async onInit() {
		const json = await getCityInformation(API.warning, this.props.cityCode);
		const { _warningExist, warningArr } = processData(json);
		this.setData({
			warningExist: _warningExist,
			warningArray: warningArr,
		});
	},
	observers: {
		cityCode: async function (newCityCode) {
			const json = await getCityInformation(API.warning, newCityCode);
			const { _warningExist, warningArr } = processData(json);
			this.setData({
				warningExist: _warningExist,
				warningArray: warningArr,
			});
		},
	},
	methods: {
		handleTap(event) {
			const data = { text: event.target.dataset.dialogText, name: event.target.dataset.dialogTitle, color: event.target.dataset.dialogColor };
			this.props.onShowSuggestDialog({ data });
		},
	},
});
