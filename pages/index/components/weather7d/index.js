import { smoothLineChart } from '../../../../utils/canvas';
import { debounce } from '../../../../utils/debounce';

Component({
	options: {
		// 使用基础库内置的数据变化观测器
		observers: true,
	},
	props: {
		day7d: null,
		night7d: null,
		temperature7d: null,
	},
	// 注意到canvas的绘制方法似乎是不能被响应式数据触发更新的，只能手动监听重绘了
	observers: {
		// 如果 temperature7d 发生变化，则重新绘制 Canvas
		// 加一个防抖。1s再执行。因为canvas绘画如果多次重复执行就直接出错，我没找到支付宝里确保完成绘制一帧再画的api，只能这么凑合下
		temperature7d: debounce(function () {
			console.log(123);
			console.log(new Date().getTime());
			// 通过 SelectorQuery 获取 Canvas 实例
			my.createSelectorQuery()
				.select('#canvas')
				.node()
				.exec((res) => {
					const canvas = res[0].node;
					smoothLineChart(canvas, this.props.temperature7d.max, this.props.temperature7d.min);
				});
		}, 1000),
	},
});
