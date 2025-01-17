<!-- 免密登录页 -->
<template>
	<view class="uni-content">
		<view class="login-logo">
			<image :src="logo" mode="aspectFill"></image>
		</view>
		<template v-if="['apple','weixin', 'weixinMobile', 'huawei', 'huaweiMobile'].includes(type)">
			<view class="quickLogin">
				<image v-if="type !== 'weixinMobile' && type !== 'huaweiMobile'" @click="quickLogin" :src="imgSrc"
					mode="widthFix" class="quickLoginBtn"></image>
				<view v-else style="position: relative">
					<button v-if="type ==='weixinMobile'" type="primary" open-type="getPhoneNumber"
						@getphonenumber="quickLogin" class="uni-btn">微信授权手机号登录</button>
					<button v-if="type === 'huaweiMobile'" open-type="getPhoneNumber" @getphonenumber="quickLogin"
						class="quickLoginBtn" style="padding: 0; display: flex">
						<image :src="imgSrc" mode="widthFix"></image>
					</button>
					<view v-if="this.needAgreements && !this.agree" class="mobile-login-agreement-layer"
						@click="showAgreementModal"></view>
				</view>
				<uni-id-pages-agreements scope="register" ref="agreements"></uni-id-pages-agreements>
			</view>
		</template>
		<template v-else>
			<text class="tip">未注册的账号验证通过后将自动注册</text>
			<view class="phone-box">
				<view @click="chooseArea" class="area">+86</view>
				<uni-easyinput trim="both" :focus="focusPhone" @blur="focusPhone = false" class="input-box"
					type="number" :inputBorder="false" v-model="phone" maxlength="11" placeholder="请输入手机号" />
			</view>
			<uni-id-pages-agreements scope="register" ref="agreements"></uni-id-pages-agreements>
			<button class="uni-btn" type="primary" @click="toSmsPage">获取验证码</button>
		</template>
		<uni-id-pages-fab-login ref="uniFabLogin"></uni-id-pages-fab-login>
		<view class="footer">
			<text>版权所有 © 湘江中路</text>
			<text>|</text>
			<text @click="toHelpPage">帮助中心</text>
		</view>
	</view>
</template>

<script>
	let currentWebview; //当前窗口对象
	import config from '@/uni_modules/uni-id-pages/config.js'
	import mixin from '@/uni_modules/uni-id-pages/common/login-page.mixin.js';
	export default {
		mixins: [mixin],
		data() {
			return {
				type: "", //快捷登录方式
				phone: "", //手机号码
				focusPhone: false,
				logo:"../../../../static/logo.jpg"
			}
		},
		computed: {
			async loginTypes() { //读取配置的登录优先级
				return config.loginTypes
			},
			isPhone() { //手机号码校验正则
				return /^1\d{10}$/.test(this.phone);
			},
			imgSrc() { //大快捷登录按钮图
				const images = {
					weixin: '/uni_modules/uni-id-pages/static/login/weixin.png',
					apple: '/uni_modules/uni-id-pages/static/app/apple.png',
					huawei: '/uni_modules/uni-id-pages/static/login/huawei.png',
					huaweiMobile: '/uni_modules/uni-id-pages/static/login/huawei-mobile.png',
				}
				return images[this.type]
			}
		},
		async onLoad(e) {
			//获取通过url传递的参数type设置当前登录方式，如果没传递直接默认以配置的登录
			let type = e.type || config.loginTypes[0]
			this.type = type

			// console.log("this.type: -----------",this.type);
			if (type != 'univerify') {
				this.focusPhone = true
			}
			this.$nextTick(() => {
				//关闭重复显示的登录快捷方式
				if (['weixin', 'apple', 'huawei', 'huaweiMobile'].includes(type)) {
					this.$refs.uniFabLogin.servicesList = this.$refs.uniFabLogin.servicesList.filter(item =>
						item.id != type)
				}
			})
			uni.$on('uni-id-pages-setLoginType', type => {
				this.type = type
			})
		},
		onShow() {
			// #ifdef H5
			document.onkeydown = event => {
				var e = event || window.event;
				if (e && e.keyCode == 13) { //回车键的键值为13
					this.toSmsPage()
				}
			};
			// #endif
		},
		onUnload() {
			uni.$off('uni-id-pages-setLoginType')
		},
		onReady() {
			// 是否优先启动一键登录。即：页面一加载就启动一键登录
			//#ifdef APP-PLUS
			if (config.loginTypes.includes('univerify') && this.type == "univerify") {
				uni.preLogin({
					provider: 'univerify',
					success: () => {
						const pages = getCurrentPages();
						currentWebview = pages[pages.length - 1].$getAppWebview();
						currentWebview.setStyle({
							"top": "2000px" // 隐藏当前页面窗体
						})
						// this.type == this.loginTypes[1]
						// console.log('开始一键登录');
						this.$refs.uniFabLogin.login_before('univerify')
					},
					fail: (err) => {
						console.log(err);
						if (config.loginTypes.length > 1) {
							this.$refs.uniFabLogin.login_before(config.loginTypes[1])
						} else {
							uni.showModal({
								content: err.message,
								showCancel: false
							});
						}
					}
				})
			}
			//#endif
		},
		methods: {
			showCurrentWebview() {
				// 恢复当前页面窗体的显示 一键登录，默认不显示当前窗口
				currentWebview.setStyle({
					"top": 0
				})
			},
			showAgreementModal() {
				this.$refs.agreements.popup()
			},
			quickLogin(e) {
				let options = {
					uniIdRedirectUrl: this.uniIdRedirectUrl
				}
				console.log(e)
				if (e.detail?.code) {
					options.phoneNumberCode = e.detail.code
				}

				if ((this.type === 'weixinMobile' || this.type === 'huaweiMobile') && !e.detail?.code) return

				this.$refs.uniFabLogin.login_before(this.type, true, options)
			},
			toSmsPage() {
				if (!this.isPhone) {
					this.focusPhone = true
					return uni.showToast({
						title: "手机号码格式不正确",
						icon: 'none',
						duration: 3000
					});
				}
				if (this.needAgreements && !this.agree) {
					return this.$refs.agreements.popup(this.toSmsPage)
				}
				// 发送验证吗
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/login/login-smscode?phoneNumber=' + this.phone
				});
			},
			//去密码登录页
			toPwdLogin() {
				uni.navigateTo({
					url: '../login/password'
				})
			},
			chooseArea() {
				uni.showToast({
					title: '暂不支持其他国家',
					icon: 'none',
					duration: 3000
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.uni-content {
		padding: 20px;
	}

	.login-logo {
		display: block;
		width: 200rpx;
		height: 200rpx;
		margin: 80rpx auto 40rpx;
		border-radius: 50%;
		overflow: hidden;
		image {
			width: 100%;
			height: 100%;
		}
	}

	@import "@/uni_modules/uni-id-pages/common/login-page.scss";

	@media screen and (min-width: 690px) {
		.uni-content {
			height: 350px;
		}
	}

	.mobile-login-agreement-layer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.uni-content,
	.quickLogin {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		align-items: center;
		/* #endif */
	}

	.phone-box {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		border: 1px solid #ddd;
		border-radius: 5px;
		margin-bottom: 20px;
	}

	.area {
		position: absolute;
		left: 10px;
		z-index: 9;
		top: 12px;
		font-size: 14px;
	}

	.area::after {
		content: "";
		border: 3px solid transparent;
		border-top-color: #000;
		top: 12px;
		left: 3px;
		position: relative;
	}

	/* #ifdef MP */
	.phone-box ::v-deep .uni-easyinput__content,
	/* #endif */
	.input-box {
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
		flex: 1;
		padding-left: 45px;
		margin-bottom: 10px;
		border-radius: 0;
	}

	.quickLogin {
		height: 350px;
		align-items: center;
		justify-content: center;
	}

	.quickLoginBtn {
		margin: 20px 0;
		width: 450rpx;
		background-color: transparent;
		border: none;
		box-shadow: none;
		/* #ifndef APP-NVUE */
		max-width: 230px;
		/* #endif */
		height: 82rpx;
	}

	.tip {
		margin-top: -15px;
		margin-bottom: 20px;
		color: #666;
		font-size: 14px;
		text-align: center;
	}

	@media screen and (min-width: 690px) {
		.quickLogin {
			height: auto;
		}
	}

	.uni-btn {
		background: linear-gradient(to right, #007AFF, #0055DD);
		color: #fff;
		border: none;
		border-radius: 5px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
		margin-bottom: 20px;
	}

	.footer {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 40px;
		color: #999;
		font-size: 12px;
		text {
			margin: 0 10px;
			cursor: pointer;
		}
	}
</style>