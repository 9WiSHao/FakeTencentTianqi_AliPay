export function smoothLineChart(canvas, maxArr, minArr) {
	const ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// 设置画布内边距，点距，计算单位距离
	const width = canvas.width;
	const height = canvas.height;
	const paddingWidth = 30;
	const paddingHeight = 23;
	const pointDistance = (width - 2 * paddingWidth) / (maxArr.length - 1);
	const max = Math.max(...maxArr);
	const min = Math.min(...minArr);
	const yRange = max - min;
	const plotHeight = height - 2 * paddingHeight;
	let lastX = 0,
		lastY = 0;
	// 定义画线和点的函数
	function drawLineAndPoints(data, color, textPosition) {
		// 绘制曲线
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = color;

		data.forEach((point, index) => {
			const x = paddingWidth + index * pointDistance;
			/**
			 * 首先注意canvas是左上角是(0,0)
			 * 然后这换算了一下，让最小值在最下面，最大值在最上面，其余按比例均匀映射到画布高度，并且留出上下空间
			 * 此处式子想想挺简单，(point - min) / yRange 就是此点高度所占比例，乘plotHeight就是真实高度
			 * 最后反转过来加上一个上下边距
			 *  */
			const y = height - paddingHeight - ((point - min) / yRange) * plotHeight;
			if (index === 0) {
				ctx.moveTo(x, y);
			} else {
				const cp1x = (x + lastX) / 2;
				const cp1y = lastY;
				const cp2x = (x + lastX) / 2;
				const cp2y = y;

				ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
			}
			lastX = x;
			lastY = y;
		});
		ctx.stroke();

		// 绘制点和文字
		// 这里不放到一个循环画，是因为点和贝塞尔曲线一块画有点bug，造成曲线两边租中间细
		ctx.fillStyle = color;
		ctx.beginPath();

		data.forEach((point, index) => {
			const x = paddingWidth + index * pointDistance;
			const y = height - paddingHeight - ((point - min) / yRange) * plotHeight;

			// 画点
			ctx.arc(x, y, 3, 0, 2 * Math.PI);
			ctx.fill();
			ctx.moveTo(x, y);

			// 画文字
			ctx.fillStyle = 'black';
			ctx.font = '16px Arial';
			let textOffset = textPosition === 'top' ? -8 : 16;
			ctx.fillText(`${point}°`, x - 6, y + textOffset);
			ctx.fillStyle = color;
		});
	}

	// 画最高温度和最低温度的线和点
	drawLineAndPoints(maxArr, '#ffb74d', 'top'); // 橙色
	drawLineAndPoints(minArr, '#4fc3f7', 'bottom'); // 蓝色
}
