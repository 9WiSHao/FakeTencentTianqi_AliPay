Component({
	methods: {
		onTapLink(e) {
			my.alert({
				title: '关于此小程序',
				content: `已将 ${e.target.dataset.text} 相关链接(${e.target.dataset.url}),复制至剪贴板,请前往浏览器粘贴查看`,
				buttonText: '确定',
				success: () => {
					// 复制链接到剪贴板
					my.setClipboard({
						text: e.target.dataset.url,
						success: () => {
							// 显示成功提示
							my.showToast({
								type: 'success',
								content: '链接已复制',
								duration: 2000,
							});
						},
						fail: () => {
							// 显示失败提示
							my.showToast({
								type: 'fail',
								content: '链接复制失败，请查看是否给与剪贴板权限',
								duration: 2000,
							});
						},
					});
				},
			});
		},
	},
});
