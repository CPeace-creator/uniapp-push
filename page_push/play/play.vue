<template>
	<view class="play" v-if="detail">
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
					<view class="group">
						<uv-number-box :min="0" :max="maxNumber" v-model="formData.number"></uv-number-box>
						<text>还剩{{maxNumber}}个名额</text>
					</view>
				</view>
			</view>
		</view>
		<view class="btnGroup">
			<view class="btn" hover-class="btnHover" hover-start-time="0" @click="handlePush">
				<text v-if="detail.active_state==1" class="nostart">点击\n抽奖</text>
				<text v-if="detail.active_state==2" class="start">停止</text>
				<text v-if="detail.active_state==3" class="end">已结束</text>
			</view>
		</view>
		<view class="logs" v-if="detail.operLogs && detail.operLogs.length>0">
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
import { computed, ref } from 'vue';
import {
		onLoad
	} from '@dcloudio/uni-app'
import DBUtils from '../../utils/dbUtils';
import { showToast } from '../../utils/utils';
import { getUUId } from '../../utils/tools';
const id = ref(null)
onLoad((e)=>{
	id.value=e.pushId
	getDetail()
})	
const formData=ref({
	id:getUUId(),
	aid:"",
	number:0
})
const range=computed(()=>detail.value?.awardsList.map(item=>({value:item.id,text:item.name})))
const detail=ref({})
//抽奖个数
const maxNumber=ref(0)
//下拉框选择事件
const selectChange=(e)=>{
	formData.value.number=0
	let find = detail.value.awardsList.find(item=>item.id===formData.value.aid)
	maxNumber.value=find.number;
}

//获取抽奖内容
const getDetail=async ()=>{
	let push=new DBUtils("push-data")
	let {data:[obj]}=await push.query({query:`_id=="${id.value}"`})
	detail.value=obj
}

//点击抽奖
const handlePush=()=>{
	if(detail.value.active_state==1){
		if(!formData.value.aid) return showToast({title:"抽奖选项未选择"})
		if(formData.value.number==0) return showToast({title:"抽奖数量不能为0"})
		detail.value.active_state=2
	}
	if(detail.value.active_state==2){
		formData.value.create_date=Date.now()
		// getDetail()
	}
	if(detail.value.active_state==3){
		return showToast({title:"活动已结束"})
	}
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
				.group{
					display: flex;
					align-items:center;
					text{
						padding-left: 30rpx;
						color: #666;
						font-size: 28rpx;
						font-weight: bolder;
					}
				}
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
