Component({
	props: {
		airQualityDetail: { aqi: '67', category: '良', color: '#F0CC35', detail: [{ key: '2', data: '2' }] },
		airQualityDialogExists: null,
		onHiddenMask: null,
		onHiddenAirQualityDialog: null,
		airQualityDialogAnimation: '',
	},
	methods: {
		hidden() {
			this.props.onHiddenAirQualityDialog();
			setTimeout(() => {
				this.props.onHiddenMask();
			}, 300);
		},
	},
});
