<template>
	<uni-notice-bar showIcon text="活动已经开始,不允许修改奖项内容" background-color="#F56C6C" color="#fff" v-if="isStart"></uni-notice-bar>
	<view class="editPage" :style="isStart?'pointer-events:none;opacity:0.5s;':''">
		<uni-notice-bar show-icon text="最多可创建9个奖项,最多支持300人参与游戏抽奖"></uni-notice-bar>
		<view class="awards">
			<view class="headTitle">——奖品奖项——</view>
			<view class="option" v-for="(item,index) in awardsList" :key="item.id">
				<view class="top">
					<view class="left" @click="addPic(index)">
						<view class="pic">
							<text v-if="item.process && item.process<100">{{item.process+"%"}}</text>
							<image v-if="item.picUrl  && item.process==100" :src="item.picUrl" mode="aspectFill">
							</image>
							<uni-icons v-if="!item.picUrl && !item.process" type="image" size="50"
								color="#555"></uni-icons>
						</view>
						<view class="text">
							更换图片
						</view>
					</view>
					<view class="right">
						<view class="row">
							<view class="name">
								<input type="text" v-model="item.name" placeholder="请输入奖项名称" />
							</view>
							<view class="remove" @click="removeAwards(index)">
								<uni-icons type="minus-filled" size="30" color="#ee4626" v-if="true"></uni-icons>
							</view>
						</view>
						<view class="row">
							<view class="name">
								<input type="text" placeholder="请输入奖品名称" v-model="item.description" />
							</view>
							<view>

							</view>
						</view>
					</view>
				</view>
				<view class="row">
					<view class="name">
						奖品份数
					</view>
					<view class="">
						<uv-number-box v-model="item.number"></uv-number-box>
					</view>
				</view>
			</view>
			<view class="addBox" v-if="awardsList.length<9">
				<view class="btn" @click="addAwards">
					增加奖项
				</view>
			</view>
		</view>
		<view class="rule">
			<view class="headTitle">——规则说明——</view>
			<textarea v-model="ruleText" placeholder="请输入规则说明" />
		</view>
		<view class="more">
			<view class="headTitle">——更多选项——</view>
			<view class="content">
				<view class="row">
					<view class="name">
						结束时间
					</view>
					<view class="control">
						<uni-datetime-picker type="datetime" :start="deftTime.start" :end="deftTime.end"
							v-model="endTime" />
					</view>
				</view>
				<view class="row">
					<view class="name">
						是否能重复中奖
					</view>
					<view class="control">
						<switch :checked="isRepeat" color="#ee4626"
							style="transform: scale(0.8);transform-origin: right;" @change="switchChange" />
					</view>
				</view>
			</view>
		</view>
		<view class="submitBtn" @click="onSubmit">
			<button type="primary" :disabled="isStart">{{id?"确认修改":"确认提交"}}</button>
		</view>
	</view>
</template>

<script setup>
	import {
		computed,
		ref
	} from 'vue'
	import {
		getUUId,
		getFileExtension
	} from '../../utils/tools';
	import {
		showToast,
		goBack,
		uploadFile
	} from '../../utils/utils';
	import dayjs from 'dayjs'
	import DBUtils from '../../utils/dbUtils';
	import {
		onLoad
	} from '@dcloudio/uni-app'
	const id=ref(null)
	onLoad(async(e) => {
		let route = getCurrentPages()[getCurrentPages().length-2].route
		if(route.includes("page_push/list/list")){
			return
		}
		if(e.id){
			id.value=e.id
			getDetial(e.id)
		}else{
			let res = await uni.showModal({
				title:"参数传递错误,请检查",icon:"error",
				showCancel:false
			})
			if(res.confirm){
				goBack()
			}
		}
	})
	const awardsList = ref([{
			name: '一等奖',
			description: '',
			picUrl: '',
			number: 1,
			id: getUUId()
		},
		{
			name: '二等奖',
			description: '',
			picUrl: '',
			number: 2,
			id: getUUId()
		},
	])
	const detail=ref({})
	const isStart=computed(()=>{
		if(!id.value) return false
		if(detail.value?.active_state!=1 || detail.value?.operLogs?.length>0){
			
			console.log(detail.value?.active_state);
			return true
		}else{
			return false
		}
		
	})
	const addAwards = () => {
		awardsList.value.push({
			name: '',
			description: '',
			picUrl: '',
			number: 1,
			id: getUUId()
		})
	}

	const removeAwards = async (index) => {
		let res = await uni.showModal({
			title: '是否删除奖项'
		})
		if (res.confirm) {
			awardsList.value.splice(index, 1)
		}
	}

	//规则说明
	const ruleText = ref(`1.点击参与报名参加活动;
2.参与后无需额外操作,等待主办方发起抽奖;
3.抽奖成功后会将抽奖结果返回,可在右上角点击查看;
4.将获奖记录给现成工作人员核销后,领取对应的奖品`)

	//添加图片
	const addPic = (index) => {
		uploadFile(1, process => {
			console.log(process);
			awardsList.value[index].process = process
		}).then(res => {
			console.log(res);
			awardsList.value[index].picUrl = res
		}).catch(err => {
			console.log(err);
		})
	}

	const endTime = ref(null)

	//日期查询
	const deftTime = ref({
		start: dayjs().format("YYYY-MM-DD HH:mm:ss"),
		end: dayjs().add(7, 'd').endOf("day").format("YYYY-MM-DD HH:mm:ss")
	})

	//检查重复
	const isRepeat = ref(false)


	//按钮切换
	const switchChange = (e) => {
		isRepeat.value = e.detail.value
	}

	const onSubmit = async () => {
		const pushData = new DBUtils("push-data")
		if (!(awardsList.value.length && awardsList.value.every(item => item.name && item.description))) {
			showToast({
				title: "奖项及奖品名称必填",
				duration: 2500
			})
			return;
		}
		if (!ruleText.value) return showToast({
			title: "抽奖规则必填",
			duration: 2500
		})
		let formData = {
			awardsList: awardsList.value,
			ruleText: ruleText.value,
			isRepeat: isRepeat.value,
			endTime: endTime.value
		}
		uni.showLoading({
			title: id.value?"修改奖项中":"创建奖项中",
			mask: true
		})
		let errCode;
		if (id.value) {
		    // 如果id大于0，调用update方法
		    const result = await pushData.update(id.value, formData);
		    errCode = result.result.errCode;
			
		} else {
		    // 如果id不大于0，调用add方法
		    const result = await pushData.add(formData);
		    errCode = result.result.errCode;
		}
		if (errCode == 0) {
			setTimeout(() => {
				showToast({
					title: id.value?"修改奖项成功":"创建奖项成功"
				})
				goBack()
			}, 1000)
		} else {
			showToast({
				title:  id.value?"修改奖项失败,请重新尝试":"创建奖项失败,请重新尝试",
				icon: "error"
			})
		}
	}
	
	//获取奖品详情
	const getDetial = async (id) => {
		let pushData = new DBUtils("push-data")
		let res = await pushData.query({
			query: `_id=="${id}"`
		})
		if(res.errCode==0){
			let data=res.data[0]
			detail.value=data
			awardsList.value=data.awardsList
			ruleText.value=data.ruleText
			isRepeat.value=data.isRepeat
			endTime.value=data.endTime
		}
	}
</script>

<style scoped lang="scss">
	.editPage {
		.headTitle {
			font-size: 34rpx;
			line-height: 2rem;
			font-weight: bolder;
			text-align: center;
			color: #ee4626;
			padding-bottom: 30rpx;
		}

		.row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 34rpx;
			border-bottom: 1rpx solid #f4f4f4;
			height: 100rpx;
			padding: 10rpx 0;
		}

		.awards {
			.option {
				padding: 20rpx;
				padding-bottom: 0;
				border-bottom: 14rpx solid #f4f4f4;

				.top {
					display: flex;

					.left {
						width: 160rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;

						.pic {
							width: 120rpx;
							height: 120rpx;
							background: #f4f4f4;
							display: flex;
							align-items: center;
							justify-content: center;

							image {
								width: 100%;
								height: 100%;
							}
						}

						.text {
							font-size: 28rpx;
							color: #999;
							line-height: 2em;
						}
					}

					.right {
						flex: 1;

						.row {
							.name {
								font-size: 38rpx;
								font-weight: bolder;
							}
						}
					}
				}
			}

			.addBox {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 60rpx 0;
				background: #f4f4f4;

				.btn {
					border: 1px solid #ee4626;
					padding: 15rpx 35rpx;
					color: #ee4626;
					font-size: 36rpx;
					border-radius: 200rpx;
				}
			}
		}

		.rule {
			padding: 20rpx;
			margin-top: 60rpx;

			textarea {
				background: #fafafa;
				border: 1px solid #efefef;
				width: 100%;
				padding: 10rpx 20rpx;
				box-sizing: border-box;
				line-height: 1.7em;
				font-size: 36rpx;
				min-height: 380rpx;
				color: #333;
			}
		}

		.more {
			margin-top: 60rpx;

			.content {
				padding: 20rpx;

				.control {
					width: 400rpx;
					display: flex;
					justify-content: flex-end;
				}
			}
		}

		.submitBtn {
			padding: 60rpx 20rpx 100rpx;

			button {
				background: #ee4626;
			}
		}
	}
</style>