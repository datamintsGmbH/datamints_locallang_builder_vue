<template><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" :width="width" :height="height"><g><path d="M7,30a1,1,0,0,1-1-1V26H5a4,4,0,0,1-4-4V6A4,4,0,0,1,5,2H23a4,4,0,0,1,4,4V22a4,4,0,0,1-4,4H12.351L7.625,29.781A1,1,0,0,1,7,30Z" fill="#631982"></path><path d="M41,46a1,1,0,0,1-.625-.219L35.649,42H25a4,4,0,0,1-4-4V22a4,4,0,0,1,4-4H43a4,4,0,0,1,4,4V38a4,4,0,0,1-4,4H42v3A1,1,0,0,1,41,46Z" fill="#e3e3e3"></path><path d="M37.038,36l-.864-2.838H31.827L30.963,36H28.239l4.208-11.971h3.09L39.762,36ZM35.57,31.042q-1.2-3.857-1.349-4.362c-.1-.337-.173-.6-.221-.8q-.269,1.046-1.541,5.162Z" fill="#631982"></path><path d="M18.332,11.058A11.18,11.18,0,0,1,17.323,13.8a11.4,11.4,0,0,1-1.61,2.311A12.731,12.731,0,0,0,20.8,18.1a7.387,7.387,0,0,0-1.234,2.213A15.988,15.988,0,0,1,14.1,17.585a16.55,16.55,0,0,1-5.618,2.746,7.284,7.284,0,0,0-1.175-2.1,14.306,14.306,0,0,0,5.2-2.115,12.567,12.567,0,0,1-1.765-2.451,11.983,11.983,0,0,1-1.079-2.6h-.28c-.672,0-1.3.028-1.862.084V8.971a15.192,15.192,0,0,0,1.919.1h3.333v-.9a5.152,5.152,0,0,0-.083-.952h2.42a4.914,4.914,0,0,0-.084.938v.911H18.57a15.414,15.414,0,0,0,1.933-.1v2.171a17.835,17.835,0,0,0-1.849-.084Zm-6.4,0a8.574,8.574,0,0,0,.938,2.115,8.421,8.421,0,0,0,1.177,1.569,7.651,7.651,0,0,0,1.106-1.555,8.012,8.012,0,0,0,.841-2.129Z" fill="#b39fee"></path></g></svg></template>

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