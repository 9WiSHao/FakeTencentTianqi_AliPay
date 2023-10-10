Component({
	props: {
		suggestDialogExists: null,
		onHiddenSuggestDialog: null,
		onHiddenMask: null,
		suggestDialogData: { text: '啥啥啥', name: 'xxx指数' },
		suggestDialogAnimation: '',
	},
	methods: {
		hidden() {
			this.props.onHiddenSuggestDialog();
			setTimeout(() => {
				this.props.onHiddenMask();
			}, 300);
		},
	},
});
