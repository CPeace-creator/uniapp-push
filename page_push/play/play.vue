<template>
	<view class="play">
		<view class="options">
			<view class="row">
				<view class="left">
					奖项选择
				</view>
				<view class="right">
					<uni-data-select v-model="formData.aid" :localdata="range" @change="selectChange"></uni-data-select>
				</view>
			</view>
			<view class="row">
				<view class="left">
					抽取个数
				</view>
				<view class="right">
					<uv-number-box v-model="formData.number" :min="0")></uv-number-box>
				</view>
			</view>
		</view>
		<view class="btnGroup">
			<view class="btn" hover-class="btnHover" hover-start-time="0">
				<text v-if="false" class="nostart">点击\n抽奖</text>
				<text v-if="false" class="start">停止</text>
				<text v-if="true" class="end">已结束</text>
			</view>
		</view>
		<view class="logs">
			<view class="title">
				——开奖记录——
			</view>
			<view class="content">
				<uni-list>
					<uni-list-item v-for="(item,index) in 5" :key="item" :to="`./list`"
					clickable="true" showArrow :title="`第${index+1}轮开奖`" note="描述文字" right-text="右侧文本内容"></uni-list-item>
				</uni-list>
			</view>
			
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
const formData=ref({
	aid:"",
	number:0
})
const range=ref([
	{value:0,text:'一等奖'},
	{value:1,text:'一等奖'},
	{value:2,text:'一等奖'},
])
//下拉框选择事件
const selectChange=(e)=>{
	formData.value.number=0
}
</script>

<style scoped lang="scss">
.play{
	.options{
		.row{
			display: flex;
			align-items: center;
			justify-content: flex-start;
			border-bottom: 1px solid #eee;
			padding: 30rpx;
			.right{
				flex:1;
			}
		}
	}
	.btnGroup{
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 100rpx 0;
		.btn{
			width: 260rpx;
			height: 260rpx;
			font-size: 46rpx;
			font-weight: bolder;
			color: #fff;
			text{
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 50%;
				position: relative;
			}
			.nostart{
				background: #ff6a33;
				&::before{
					content: "";
					display: block;
					width: 110%;
					height: 110%;
					border: 1px solid transparent;
					border-top-color: #ee4626;
					position: absolute;
					top: -5%;
					left: -5%;
					border-radius: 50%;
					box-sizing: border-box;
					animation: rotate 0.7s infinite linear;
				}
				&::after{
					content: "";
					display: block;
					width: 120%;
					height: 120%;
					border: 1px solid transparent;
					border-top-color: #ee4626;
					position: absolute;
					top: -10%;
					left: -10%;
					border-radius: 50%;
					box-sizing: border-box;
					animation: rotate 1.2s infinite linear;
				}
			}
			.start{
				background: #ee4626;	
			}
			.end{
				background: #888;
			}
		}
		.btnHover{
			transform: scale(0.97);
		}
	}
	.logs{
		padding: 100rpx 30rpx;
		.title{
			text-align: center;
			font-size: 36rpx;
			color: #999;
			font-weight: bolder;
		}
		.content{
			padding: 50rpx 0;
		}
	}
}
@keyframes rotate {
	0%{
		transform: rotate(0);
	}
	100%{
		transform: rotate(360deg);
	}
}
</style>
