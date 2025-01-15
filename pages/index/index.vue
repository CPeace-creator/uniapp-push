<template>
	<view class="content">
		<image src="../../static/raffle-pic.jpg" mode="" @click="routeTo('/page_push/list/list')"></image>
		<text>点击图片可参与活动</text>
	</view>
</template>

<script setup>
	import {
		routeTo
	} from '../../utils/utils.js'
</script>

<style scoped lang="scss">
	.content {
		width: 800rpx;
		height: 1100rpx;

		image {
			width: 100%;
			height: 100%;
		}

		text {
			font-size: 38rpx;
			font-weight: bolder;
		}
	}
</style>