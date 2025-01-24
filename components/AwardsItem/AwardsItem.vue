<template>
	<view class="awardsItem">
		<view class="userInfo">
			<image  class="pic" :src="item.award_userInfo?item.award_userInfo.avatar_file.url:'../../static/logo.jpg'" mode="aspectFill"></image>
			<view class="text">
				{{item.award_userInfo.nickname}}
			</view>	
		</view>
		<view class="body">
			<view class="left">
				<image class="pic" :src="item.award_pic" mode="aspectFill" @click="clickAwardPic"></image>
			</view>
			<view class="right">
				<view class="title">
					{{item.award_name}}
				</view>
				<view class="info">
					<view class="line">
						奖品:{{item.award_des}}
					</view>
					<view class="line">
						轮次:第{{item.order_number}}轮中奖
					</view>
					<view class="line">
						时间:{{dayjs(item.create_date).format('YYYY-MM-DD HH:mm:ss')}}
					</view>
					<view class="line">
						<button type="primary" size="mini" v-if="writeOff" @click="onWriteOff" :disabled="item.status==1">手动核销</button>
						<button type="primary" size="mini" v-if="code" @click="onCode" :disabled="item.status==1">兑换码</button>
					</view>
				</view>
			</view>
		</view>
		<view class="confirm" v-if="confirm">
			<button type="primary">确认核销</button>
		</view>
	</view>
</template>

<script setup>
import dayjs from 'dayjs';
import { showToast } from '../../utils/utils';
const emits=defineEmits(['success'])
const db=uniCloud.database()
const props=defineProps({
	writeOff:{
		type:Boolean,
		default:false
	},
	code:{
		type:Boolean,
		default:false
	},
	confirm:{
		type:Boolean,
		default:false
	},
	item:{
		type:Object,
		default:{}
	}
})

//点击核销
const onWriteOff=async()=>{
	 let res= await uni.showModal({
	 	title:"核销中",
		content:"是否确认核销该中奖信息"
	 })
	 if(!res.confirm) return;
	 try{
		 uni.showLoading({
		 	title:"操作中",mask:true
		 })
		 let {result:{errCode}}=await db.collection("push-award-user").doc(props.item._id).update({
		 		 status:1
		 })
		 if(errCode!=0) return showToast({title:"操作有误请重新操作"})
		 emits("success")
	 }catch(err){
		 showToast({title:err})
	 }finally{
		 uni.hideLoading()
	 }
 }
 const onCode=()=>{
	 
 }
 const clickAwardPic = () => {
 	let urls = [props.item.award_pic.split("?")[0]]
 	uni.previewImage({
 		urls
 	})
 }
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
	.confirm{
		padding: 20rpx;
		padding-top: 60rpx;
	}
}
</style>