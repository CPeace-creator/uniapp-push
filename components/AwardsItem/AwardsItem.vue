<template>
	<view class="awardsItem">
		<view class="userInfo">
			<image  class="pic" src="../../static/logo.jpg" mode="aspectFill"></image>
			<view class="text">
				湘江中路
			</view>
		</view>
		<view class="body">
			<view class="left">
				<image class="pic" src="../../static/logo.jpg" mode="aspectFill"></image>
			</view>
			<view class="right">
				<view class="title">
					一等奖
				</view>
				<view class="info">
					<view class="line">
						发品:IPhone手机
					</view>
					<view class="line">
						轮次:第三轮中奖
					</view>
					<view class="line">
						时间:2025-01-13 12:00:00
					</view>
					<view class="line">
						<button type="primary" size="mini">手动核销</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
 
</script>

<style lang="scss" scoped>
.awardsItem{	
	border: 1px solid #eee;
	border-radius: 10rpx;
	border-bottom-width: 3px;
	.userInfo{
		height: 80rpx;
		background: #eee;
		display: flex;
		padding: 0 30rpx;
		align-items: center;
		.pic{
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
			border:1px solid #fff;
		}
		.text{
			font-size: 32rpx;
			font-weight: bolder;
			margin-left: 15rpx;
		}
	}
	.body{
		display: flex;
		padding: 30rpx;
		.left{
			width: 230rpx;
			height: 230rpx;
			.pic{
				width: 100%;
				height: 100%;
			}
		}
		.right{
			flex:1;
			padding-left: 20rpx;
			.title{
				font-size: 38rpx;
				font-weight: bolder;
			}
			.info{
				margin-top: 20rpx;
				font-size: 28rpx;
				color: #666;
				line-height: 1.5em;
				.line{
					padding-bottom: 10rpx;
				}
			}
		}
	}
}
</style>