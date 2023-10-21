Component({
	props: {
		maskExists: null,
		onHiddenMask: null,
		onHiddenSuggestDialog: null,
		onHiddenAirQualityDialog: null,
	},
	methods: {
		hidden() {
			setTimeout(() => {
				this.props.onHiddenMask();
				this.props.onHiddenSuggestDialog();
				this.props.onHiddenAirQualityDialog();
			}, 300);
		},
	},
});
