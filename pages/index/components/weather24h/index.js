import { API } from '../../../../utils/apis';
import { getCityInformation } from '../../../../utils/myrequest';
import { get24hJson } from '../../../../utils/conversion';
import { setIconSrc } from '../../../../utils/conversion';

function collat24hData(json, sunTime) {
	let jsonAfter = get24hJson(json, sunTime.sunrise1, sunTime.sunset1, sunTime.sunrise2, sunTime.sunset2);

	let sunriseTime1 = parseInt(sunTime.sunrise1.split(':')[0]);
	let sunsetTime1 = parseInt(sunTime.sunset1.split(':')[0]);
	let sunriseTime2 = parseInt(sunTime.sunrise2.split(':')[0]);
	let sunsetTime2 = parseInt(sunTime.sunset2.split(':')[0]);
	let sunriseTime = sunriseTime1;
	let sunsetTime = sunsetTime1;

	if (sunriseTime1 < parseInt(jsonAfter.hourly[0].fxTime.split('T')[1].split(':')[0])) {
		sunriseTime = sunriseTime2;
	}
	if (sunsetTime1 < parseInt(jsonAfter.hourly[0].fxTime.split('T')[1].split(':')[0])) {
		sunsetTime = sunsetTime2;
	}

	let weather24hArrTemp = [];
	for (let i = 0; i < 26; i++) {
		// 这是遇到日出日落把图片得换了，文字也要换。然后00:00的文字要换成明天
		let time = jsonAfter.hourly[i].fxTime.split('T')[1].split('+')[0];
		let hour = parseInt(time.split(':')[0]);
		let d = 'night';
		let temperature = `${jsonAfter.hourly[i].temp}°`;

		if (hour > sunriseTime && hour <= sunsetTime) {
			d = 'day';
		}
		if (jsonAfter.hourly[i].text == 'sunset') {
			d = 'sunset';
			temperature = '日落';
		}
		if (jsonAfter.hourly[i].text == 'sunrise') {
			d = 'sunrise';
			temperature = '日出';
		}
		if (time == '00:00') {
			time = '明天';
		}
		weather24hArrTemp[i] = { time: time, iconSrc: setIconSrc(jsonAfter.hourly[i].text, d), temperature: temperature };
	}
	return weather24hArrTemp;
}

let json = null;

Component({
	options: {
		// 使用基础库内置的数据变化观测器
		observers: true,
	},
	props: {
		sunTime: null,
		cityCode: '101044000',
	},
	data: {
		weather24hArr: [
			{ time: '11:00', iconSrc: '/images/day/qing.png', temperature: '33°' },
			{ time: '11:00', iconSrc: '/images/day/qing.png', temperature: '33°' },
		],
	},
	// 这里是，由于日出日落时间依赖于7日天气的请求，所以有可能传过来的比直接请求24h天气慢。如果是传过来慢了，检测到数据更新，再请求一次。
	async onInit() {
		json = await getCityInformation(API.weather24h, this.props.cityCode);
		const weather24hArrTemp = collat24hData(json, this.props.sunTime);
		this.setData({
			weather24hArr: weather24hArrTemp,
		});
	},
	didUpdate(prevProps, prevData) {
		/**
		 * 踩坑警告！
		 * 注意，sunTime初始化是null，然后父组件传入值，这有个延迟，会触发didUpdate()钩子
		 * 而且因为传入的默认值和null不一样，能通过这个检查，就直接触发下面操作了
		 * 而且这个第一次传入默认值的延迟比上面异步网络请求的await阻塞快
		 * 导致下面用json = null的默认值去做操作，null里啥都读不出来
		 * 解决可以是让sunTime默认值和传入的一样，或者是直接再多检查下把初次传值，不让null的情况触发
		 * */
		if (JSON.stringify(this.props.sunTime) !== JSON.stringify(prevProps.sunTime) && json != null) {
			const weather24hArrTemp = collat24hData(json, this.props.sunTime);
			this.setData({
				weather24hArr: weather24hArrTemp,
			});
		}
	},
	// 检测城市代码，如果变了就重新渲染
	/**
	 * 经过学习，意识到其实用observers观测者检测数据变化和用didUpdate钩子检测数据变化差不多
	 * 两者基本能相互替代
	 * 但是其实观测者好用些，能直接精确设置检测哪个数据触发哪个函数
	 * didUpdate钩子是只要任何响应数据变了，就会触发，还需要手写对比变化数据，然后再触发对应操作
	 * 或许钩子好用在要页面ui全改的地方用
	 *
	 * 你问我为什么一开始那个用钩子没用观测者？因为我被gpt4坑了，它训练集截止21年，他说支付宝没有
	 * 后来查文档才看见之后新加了
	 * 算了，反正是练习用的小程序，都写写都用用，见证学习过程
	 */
	observers: {
		cityCode: async function () {
			json = await getCityInformation(API.weather24h, this.props.cityCode);
			const weather24hArrTemp = collat24hData(json, this.props.sunTime);
			this.setData({
				weather24hArr: weather24hArrTemp,
			});
		},
	},
});
