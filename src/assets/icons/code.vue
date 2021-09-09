<template><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" :width="width" :height="height"><g stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" stroke-miterlimit="10" :fill="_secondaryfill" :stroke="_secondaryfill"><polyline fill="none" points="12,16 4,24 12,32 " :stroke="fill"></polyline> <polyline fill="none" points="36,16 44,24 36,32 " :stroke="fill"></polyline> <line fill="none" x1="20" y1="40" x2="28" y2="8"></line></g></svg></template>

<script>
export default {
	props: {
		width: {
			type: [Number, String],
			default: "100%"
		},
		height: {
			type: [Number, String],
			default: "100%"
		},
		fill: {
			type: String,
			default: "currentColor"
		},
		secondaryfill: {
			type: String
		}
	},
	computed: {
		_secondaryfill: function () {
			return this.secondaryfill || this.fill
		}
	}
}
</script>