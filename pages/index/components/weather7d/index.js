import { smoothLineChart } from '../../../../utils/canvas';

Component({
	props: {
		day7d: null,
		night7d: null,
		temperature7d: null,
	},
	didUpdate(prevProps, prevData) {
		// 注意到canvas的绘制方法似乎是不能被响应式数据触发更新的，只能手动监听重绘了
		if (JSON.stringify(this.props.temperature7d) !== JSON.stringify(prevProps.temperature7d)) {
			// 如果 temperature7d 发生变化，则重新绘制 Canvas
			this.onCanvasReady();
		}
	},
	methods: {
		onCanvasReady() {
			// 通过 SelectorQuery 获取 Canvas 实例
			my.createSelectorQuery()
				.select('#canvas')
				.node()
				.exec((res) => {
					const canvas = res[0].node;
					smoothLineChart(canvas, this.props.temperature7d.max, this.props.temperature7d.min);
				});
		},
	},
});
