<template>
	<view class="detail" v-if="detial">
		<view class="main" :style="{paddingTop: getStatusBarHeight()+'px'}">
			<view class="titleBar" :style="{height:getTitleBarHeight()+'px'}">
				<view class="menu">
					<view class="item" @click="goBack()" v-if="pageRoute.length>1">
						<uni-icons type="left" size="26" color="#fff"></uni-icons>
					</view>
					<view class="item" @click="routeTo('/page_push/list/list','redirectTo')">
						<uni-icons type="home-filled" size="26" color="#fff"></uni-icons>
					</view>
				</view>
				<view class="userInfo" @click="handleUserInfo">
					<view class="avatar">
						<cloud-image
							:src="store.userInfo.avatar_file?store.userInfo.avatar_file.url:'https://mp-a1a93688-107c-418f-b039-e17908539fce.cdn.bspapp.com/push-project/defAvatar.jpg'"></cloud-image>
					</view>
					<view class="name">{{store.hasLogin?store.userInfo.nickname:"点击登录"}}</view>
				</view>
			</view>
			<view class="statusGroup">
				<template v-if="!detial?.isJoin && detial.active_state!=3">
					<view class="add btn" @click="handleJoin">
						<text>点击\n参与</text>
					</view>
				</template>
				<template v-else>
					<view class="nostart btn" v-if="detial.active_state==1">
						未开始
					</view>
					<view class="start btn" v-if="detial.active_state==2">
						进行中
					</view>
					<view class="end btn" v-if="detial.active_state==3">
						已结束
					</view>
				</template>
			</view>
			<view class="count" @click="routeTo(`/page_push/detail/join_user?pushId=${detial._id}`)">
				<view class="text">
					已有<text class="" big>{{detial?.join_count}}</text>人参与
				</view>
				<view class="group" v-if="detial.avatars">
					<view class="pic" v-for="(item,index) in detial.avatars" :key="index" :style="{zIndex:6-index}">
						<image :src="item" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="body">
			<view class="item">
				<view class="title">——奖品奖项——</view>
				<view class="content">
					<view class="row" v-for="(item,index) in detial?.awardsList" :key="item.id">
						<view class="pic" @click="clickAwardPic(index)">
							<image :src="item.picUrl" mode="aspectFill">
							</image>
						</view>
						<view class="text">
							<view class="name">
								{{item.name}} ({{item.number}}名)
							</view>
							<view class="descrition">
								{{item.description}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="title rule">——规则说明——</view>
				<view class="content">
					<text>
						{{detial?.ruleText}}
					</text>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="copyright">
				<text>抽奖活动为学习交流使用\n
					不会发放真实的物品\n
					最终解释权归主办方@湘江中路所有</text>
			</view>
		</view>
		<view class="menuBar">
			<view class="group" :style="{opacity:menuState?1:0,transform:menuState?'scaleY(1)':'scaleY(0)'}">
				<view class="item" hover-class="hoverItem"
					@click="routeTo('/page_push/awardsLog/awardsLog?pushId='+detial._id)">
					<uni-icons type="gift-filled" size="30"></uni-icons>
					<view class="text">中奖纪录</view>
				</view>
				<view class="item" hover-class="hoverItem" @click="shareQRCode">
					<uni-icons type="paperplane-filled" size="30"></uni-icons>
					<view class="text">分享抽奖</view>
				</view>
				<view v-if="detial?.user_id==store.userInfo._id" class="item" hover-class="hoverItem"
					@click="routeTo(`/page_push/edit/edit?id=${detial._id}`)">
					<uni-icons type="gear-filled" size="30"></uni-icons>
					<view class="text">设置编辑</view>
				</view>
				<view v-if="detial?.user_id==store.userInfo._id" class="item" hover-class="hoverItem"
					@click="routeTo(`/page_push/play/play?pushId=${detial._id}`)">
					<uni-icons type="paperplane-filled" size="30"></uni-icons>
					<view class="text">抽奖管理</view>
				</view>
				<view v-if="detial?.user_id==store.userInfo._id" class="item" hover-class="hoverItem"
				@click="scanCode(id)">
					<uni-icons type="scan" size="30"></uni-icons>
					<view class="text">扫码核销</view>
				</view>
			</view>
			<view class="close" @click="menuChange">
				<uni-icons type="closeempty" size="15" color="#fff" v-if="menuState"></uni-icons>
				<uni-icons type="list" size="15" color="#fff" v-else></uni-icons>
			</view>
		</view>
	</view>
	<uni-popup :is-mask-click="false" ref="runPopup" mask-background-color="rgba(0,0,0,0.8)">
		<view class="runPopup">
			<view class="turntable">
				<image
					src="https://mp-a1a93688-107c-418f-b039-e17908539fce.cdn.bspapp.com/push-project/turntable-rotate.png"
					mode="aspectFill"></image>
			</view>
		</view>
	</uni-popup>
	<uni-popup :is-mask-click="false" ref="resultPopup" mask-background-color="rgba(0,0,0,0.8)">
		<view class="resultPopup">
			<view class="bg win" v-if="detial?.result?.value==1">
				<view class="text">
					{{detial.result.name}}
					<view class="subTxt">
						({{detial.result.description}})
					</view>
				</view>
			</view>
			<view class="bg loser" v-if="detial?.result?.value==0">

			</view>
			<view class="close" @click="closeResultPopup">
				<image src="../../static/close.png" mode="aspectFill"></image>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		getStatusBarHeight,
		getTitleBarHeight,
		goBack,
		routeTo,
		showToast,scanCode
	} from '../../utils/utils';
	import DBUtils from '../../utils/dbUtils';
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		store
	} from '@/uni_modules/uni-id-pages/common/store.js'
	import {
		base64ToPath
	} from 'image-tools'
	const menuState = ref(true)
	const pageRoute = ref(getCurrentPages())
	const resultPopup = ref(null)
	const clickAwardPic = (index) => {
		let urls = detial.value.awardsList.map(item => item.picUrl.split("?")[0])
		uni.previewImage({
			urls,
			current: index
		})
	}
	const id = ref(null)
	onLoad(async (e) => {
		e.scene ? id.value = decodeURIComponent(e.scene) : id.value = e.id
		if (e.id || (e.scene && e.scene !== "0")) {
			id.value = e.id
			getDetial()
		} else {
			let res = await uni.showModal({
				title: "参数传递错误,请检查",
				icon: "error",
				showCancel: false
			})
			if (res.confirm) {
				uni.redirectTo({
					url: "/page_push/list/list"
				})
			}
		}
	})
	const menuChange = () => {
		menuState.value = !menuState.value
	}
	const runPopup = ref(null)

	const closeResultPopup = () => {
		resultPopup.value.close()
	}
	const detial = ref(null)
	const db = uniCloud.database()
	const dbCmd = db.command
	const $ = dbCmd.aggregate
	const QRCodeObj = uniCloud.importObject("QRCode")
	//获取列表详情
	const getDetial = async () => {
		let res = await db.collection("push-data").aggregate()
			.match({
				_id: id.value
			})
			.lookup({
				from: "push-join-user",
				let: {
					pushID: "$_id"
				},
				pipeline: $.pipeline().match(
						dbCmd.expr($.and([
							$.eq(["$$pushID", "$push_id"]),
							$.eq(["$award_user_id", store.userInfo._id])
						]))
					).count("length")
					.done(),
				as: "joinState"
			}).lookup({
				from: "push-join-user",
				let: {
					pushID: "$_id"
				},
				pipeline: $.pipeline().match(
						dbCmd.expr($.and([
							$.eq(["$$pushID", "$push_id"])
						]))
					).project({
						award_user_id: true
					}).sort({
						_id: -1
					}).limit(30)
					.done(),
				as: "joinUsers"
			}).addFields({
				userList: $.map({
					input: "$joinUsers",
					in: "$$this.award_user_id"
				})
			})
			.lookup({
				from: "uni-id-users",
				let: {
					userList: "$userList"
				},
				pipeline: $.pipeline().project({
						avatar_file: true
					}).match(
						dbCmd.expr($.and([
							$.in(["$_id", "$$userList"])
						]))
					).match({
						avatar_file: $.neq(null)
					}).sort({
						_id: -1
					}).limit(30)
					.done(),
				as: "avatars"
			})
			.project({
				avatars: $.map({
					input: "$avatars",
					in: "$$this.avatar_file.url"
				}),
				isJoin: $.cond({
					if: $.gt([$.arrayElemAt(['$joinState.length', 0]), 0]),
					then: true,
					else: false
				}),
				active_state: true,
				awardsList: true,
				create_date: true,
				join_count: true,
				ruleText: true,
				user_id: true,
				_id: true
			}).end();
		// let pushData = new DBUtils("push-data")
		// let res = await pushData.query({
		// 	query: `_id=="${id}"`,
		// 	orderBy: "create_date desc"
		// })
		if (!res.result.data[0]) {
			let res = await uni.showModal({
				content: "没有查询到数据,返回首页",
				showCancel: false
			})
			if (res.confirm) {
				uni.redirectTo({
					url: "/page_push/list/list"
				})
				return
			}
		}
		res.result.data[0].awardsList = res.result.data[0].awardsList.map(item => {
			//?x-oss-process=iamge/resize,w_120,m_lfit使用阿里云图片压缩
			return {
				...item,
				picUrl: item.picUrl ? item.picUrl + "?x-oss-process=iamge/resize,w_120,m_lfit" :
					"https://mp-a1a93688-107c-418f-b039-e17908539fce.cdn.bspapp.com/push-project/prizePic.webp"
			}
		})
		if (res.result.errCode == 0) {
			detial.value = res.result.data[0]
		}
	}
	const handleUserInfo = () => {
		if (!store.hasLogin) return routeTo("/uni_modules/uni-id-pages/pages/login/login-withoutpwd")
		routeTo("/uni_modules/uni-id-pages/pages/userinfo/userinfo")
	}

	//点击参与
	const handleJoin = async () => {
		if (!store.hasLogin) {
			return routeTo("/uni_modules/uni-id-pages/pages/login/login-withoutpwd")
		} else {
			uni.showToast({
				title: "请稍后",
				mask: true
			})
			try {
				let pushData = new DBUtils("push-join-user")
				let {
					result: {
						total
					}
				} = await pushData.count({
					query: `push_id:'${id.value}',award_user_id:'${store.userInfo._id}'`
				});
				if (total) {
					showToast({
						title: "已经参与过了不可重复参与!"
					})
					getDetial()
					return
				}
				let {
					result: {
						errCode
					}
				} = await pushData.add({
					push_id: id.value,
					award_user_id: store.userInfo._id
				})
				if (errCode == 0) uni.showToast({
					title: "参与成功"
				})
				getDetial()
			} catch (err) {
				showToast({
					title: err
				})
			}
		}

	}
	uni.onPushMessage(res => {
		console.log("推送消息", res)
		if (res.data.payload.type == 'push') {
			detial.value.active_state = res.data.payload.active_state
			//活动开始
			if (detial.value.active_state == 2) {
				resultPopup.value.close()
				runPopup.value.open()
				return
			}
			//活动停止
			if (detial.value.active_state == 1) {
				if (res.data.payLoad?.reset) return runPopup.value.close()
				detial.value.result = res.data.payload.result
				runPopup.value.close()
				resultPopup.value.open()
				return
			}
		}
		if (res.data.payload.type == 'joinUser') {
			detial.value.join_count = res.data.payload.join_count
			detial.value.avatars = res.data.payload.avatars
		}

	})
	//分享抽奖
	const imgPic = ref(null)
	const shareQRCode = async () => {
		let res = await QRCodeObj.getUnlimited({
			page: "page_push/detail/detail",
			scene: id.value,
			check_path: false,
			auto_color: true
		})
		let path = await base64ToPath(res)
		uni.previewImage({
			urls: [path]
		})
	}
</script>

<style scoped lang="scss">
	.detail {
		min-height: 100vh;
		background: #ee4626;

		.main {
			height: 1566rpx;
			background: url("https://mp-a1a93688-107c-418f-b039-e17908539fce.cdn.bspapp.com/push-project/raffleBg.webp") no-repeat center top;
			background-size: contain;
			position: relative;

			.titleBar {
				// border: 1px solid green;
				align-items: center;
				display: flex;
				width: fit-content;

				.menu {
					display: flex;
					align-items: center;
					background: rgba(0, 0, 0, 0.6);
					border-radius: 200rpx;
					height: 80%;
					margin-left: 30rpx;

					.item {
						display: flex;
						align-items: center;
						justify-content: center;
						height: 100%;
						aspect-ratio: 1 / 1;
					}
				}

				.userInfo {
					display: flex;
					align-items: center;
					height: 100%;
					width: 100%;
					margin-left: 30rpx;

					.avatar {
						display: flex;
						justify-content: center;
						align-items: center;
						height: 100rpx;
						width: 100rpx;
						border-radius: 50%;
						overflow: hidden;
						border: 2px solid #fff;
					}

					.name {
						padding-left: 15rpx;
						color: #fff;
						font-size: 14;
						font-weight: 1000;
					}
				}
			}

			.statusGroup {
				position: absolute;
				width: 200rpx;
				height: 200rpx;
				top: 856rpx;
				left: 50%;
				transform: translateX(-100rpx);

				.btn {
					width: 100%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;
					color: #fff;
					font-size: 46rpx;
					font-weight: 1000;
				}

				.add {
					background: #e02800;
					position: relative;
					// 加载动画 1s钟 infinite重复执行
					animation: anim1 1s infinite;

					&::after {
						position: absolute;
						content: "";
						width: 100%;
						height: 100%;
						border: 5px solid #e02800;
						left: 0;
						top: 0;
						border-radius: 50%;
						box-sizing: border-box;
						animation: anim2 1s infinite;
					}
				}

				.end {
					color: #db2b00;
				}
			}

			.count {
				position: absolute;
				text-align: center;
				top: 1330rpx;
				width: fit-content;
				left: 270rpx;
				right: 0;
				margin: 0, auto;

				.text {
					font-size: 34rpx;

					.big {
						font-weight: bolder;
					}
				}

				.group {
					display: flex;
					align-items: center;
					justify-content: center;
					transform: translateX(8rpx);
					padding-top: 10rpx;

					.pic {
						width: 50rpx;
						height: 50rpx;
						overflow: hidden;
						border-radius: 50%;
						border: 2px solid #fff;
						margin-left: -15rpx;
						box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.3);
						position: relative;

						image {
							width: 100%;
							height: 100%;
						}
					}
				}

			}

		}

		.body {
			min-height: 200rpx;
			background: url("https://mp-a1a93688-107c-418f-b039-e17908539fce.cdn.bspapp.com/push-project/raffle-repeat.jpg") repeat-y center;
			background-size: contain;
			padding: 0 70rpx;

			.title {
				font-size: 50rpx;
				color: #e02800;
				font-weight: bolder;
				text-align: center;

				&.rule {
					.content {
						font-size: 40rpx;
						line-height: 1.8em;
					}
				}
			}

			.content {
				padding: 40rpx 0;
			}

			.item {
				padding-bottom: 20rpx;

				&:last-child {
					padding-bottom: 0;
				}

				.content {
					.row {
						display: flex;
						align-items: center;
						padding-bottom: 30rpx;

						&:last-child {
							padding-bottom: 0;
						}

						.pic {
							width: 120rpx;
							height: 120rpx;
							overflow: hidden;
							border-radius: 50%;
							border: 1px solid #e02800;

							image {
								height: 100%;
								width: 100%;
							}
						}

						.text {
							padding-left: 20rpx;

							.name {
								font-size: 38rpx;
								font-weight: bolder;
							}

							.descrition {
								font-size: 32rpx;
								color: #888;
								padding-top: 10rpx;
							}
						}
					}
				}
			}
		}

		.footer {
			min-height: 200rpx;
			background: url("https://mp-a1a93688-107c-418f-b039-e17908539fce.cdn.bspapp.com/push-project/raffle-footer.jpg") no-repeat center top;
			background-size: contain;

			.copyright {
				font-size: 28rpx;
				text-align: center;
				line-height: 1.8em;
				padding: 140rpx 0 60rpx;
				color: #fff;
				opacity: 0.8;
			}
		}

		.menuBar {
			position: fixed;
			top: 50%;
			right: 15rpx;
			transform: translateY(-50%);
			display: flex;
			align-items: center;
			flex-direction: column;

			.group {
				display: grid;
				gap: 30rpx;
				transition: 0.3s;
				transform-origin: bottom center;

				.item {
					background: #f9e800;
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					box-shadow: 0 0 15rpx rgba(0, 0, 0, 0.6);

					.text {
						font-size: 24rpx;
						transform: scale(0.85);
					}
				}

				.hoverItem {
					transform: scale(0.95);
				}
			}

			.close {
				width: 70rpx;
				height: 70rpx;
				background: rgba(0, 0, 0, 0.9);
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 30rpx;
				line-height: 1em;
			}
		}


	}

	@keyframes anim1 {
		0% {
			transform: scale(1);
		}

		50% {
			transform: scale(1.1);
		}

		100% {
			transform: scale(1);
		}
	}

	@keyframes anim2 {
		0% {
			transform: scale(1);
			border-width: 5px;
		}

		100% {
			transform: scale(1.6);
			border-width: 1px;
			//透明度
			opacity: 0;
		}
	}

	.runPopup {
		width: 744rpx;
		height: 1016rpx;
		background: url('https://mp-a1a93688-107c-418f-b039-e17908539fce.cdn.bspapp.com/push-project/turntable.png');
		background-size: contain;
		position: relative;

		.turntable {
			width: 522rpx;
			height: 522rpx;
			position: absolute;
			top: 69rpx;
			left: 111rpx;
			animation: rotate 1s infinite linear;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.resultPopup {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 100rpx;

		.bg {
			background: no-repeat center;
			background-size: cover;
			position: relative;
		}

		.win {
			width: 750rpx;
			height: 855rpx;
			background-image: url('https://mp-a1a93688-107c-418f-b039-e17908539fce.cdn.bspapp.com/push-project/win.png');

			.text {
				height: 120rpx;
				text-align: center;
				position: absolute;
				width: 100%;
				top: 725rpx;
				left: 0;
				color: #fff;
				font-size: 46rpx;
				font-weight: bolder;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;

				.subTxt {
					font-size: 26rpx;
					padding-top: 10rpx;
				}
			}
		}

		.loser {
			width: 561rpx;
			height: 528rpx;
			background-image: url('https://mp-a1a93688-107c-418f-b039-e17908539fce.cdn.bspapp.com/push-project/loser.png');
		}

		.close {
			width: 90rpx;
			height: 90rpx;
			margin-top: 80rpx;
			border: 1px solid red;
			padding: 20rpx;
			box-sizing: content-box;

			image {
				width: 100%;
				height: 100%;
			}
		}

	}

	@keyframes rotate {
		0% {
			transform: rotate(0);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>