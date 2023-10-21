Component({
	props: {
		airQuality: {
			aqi: '67',
			category: '良',
			color: '#A3D765',
		},
		onShowAirQualityDialog: null,
	},
	methods: {
		handleTap() {
			this.props.onShowAirQualityDialog();
		},
	},
});
