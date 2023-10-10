Component({
	props: {
		maskExists: null,
		onHiddenMask: null,
		onHiddenSuggestDialog: null,
	},
	methods: {
		hidden() {
			setTimeout(() => {
				this.props.onHiddenMask();
				this.props.onHiddenSuggestDialog();
			}, 300);
		},
	},
});
