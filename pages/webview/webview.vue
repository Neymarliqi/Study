<template>
	<view>
		<!--  -->
		<web-view :src="surl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				surl:''
			}
		},
		onLoad(options) {
			this.surl = decodeURI(options.url)
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
