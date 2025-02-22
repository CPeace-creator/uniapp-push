import {
	getUUId,
	getFileExtension
} from './tools';
import dayjs from 'dayjs';
const db=uniCloud.database()
const SYSTEM_INFO = uni.getSystemInfoSync();

export const getStatusBarHeight = () => SYSTEM_INFO.statusBarHeight || 15;

export const getTitleBarHeight = () => {
	// #ifdef MP-WEIXIN || MP-QQ || MP-BAIDU || MP-TOUTIAO
	if (uni.getMenuButtonBoundingClientRect()) {
		let {
			top,
			height
		} = uni.getMenuButtonBoundingClientRect()
		return height + (top - getStatusBarHeight()) * 2
	} else {
		return 40;
	}
	// #endif
	return 40
}

export const routeTo = (url, type = 'navigate') => {
	if (type === 'navigate') {
		uni.navigateTo({
			url
		})
	} else if (type === 'redirectTo') {
		uni.redirectTo({
			url
		})
	} else if (type === 'reLaunch') {
		uni.reLaunch({
			url
		})
	} else {
		return "错误信息";
	}
}


export const goBack = (back = 1) => {
	uni.navigateBack({
		back
	})
}

//上传图片
export function uploadFile(count = 1, callBack) {
	return new Promise((reslove, reject) => {
		uni.chooseImage({
			count: 1,
			success: (res) => {
				if (res.tempFilePaths.length > 0) {
					console.log(res.tempFilePaths);
					let filePath = res.tempFilePaths[0]
					let suffixName = ""
					// #ifdef MP
					suffixName = getFileExtension(filePath)
					// #endif
					// #ifdef H5
					suffixName = getFileExtension(res.tempFiles[0].name)
					// #endif
					uni.showLoading({
						mask: true,
						title: "上传中"
					})
					let index = 0;
					uniCloud.uploadFile({
						filePath,
						cloudPathAsRealPath: true,
						cloudPath: `raffle/${dayjs(Date.now()).format("YYYYMMDD")}/${getUUId()}.${suffixName}`,
						success: res => {
							reslove(res.fileID)
							uni.hideLoading()
						},
						fail: error => {
							reject(error);
							uni.hideLoading();
						},
						onUploadProgress: event => {
							let percent = Math.round(
								(event.loaded * 100) / event.total);
							callBack(percent)
						}
					})
				}
				console.log(res);
			}
		})
	})

}

//自定义弹窗
export function showToast({
	title = "",
	duration = 1500,
	icon = 'none',
	mask = false
}) {
	uni.showToast({
		title: String(title),
		duration,
		icon,
		mask
	})
}

export const getActiveState = (active) => {
	switch (active) {
		case 1:
			return "未开始";
			break;

		case 2:
			return "进行中";
			break;
		case 3:
			return "已结束";
			break;
	}
}

//扫码核销
export const scanCode = (pushId)=>{
	uni.scanCode({
		success: async (res) => {
		let [path,params] = res.path.split("?")
		console.log(path,params);
		let [,award_id]=params.split("=")
		if(path!='page_push/play/confirm') return showToast({title:"小程序码参数有误"})
		let {result:{data:[detail]}} = await db.collection("push-award-user").doc(award_id).field("push_id").get()
		if(detail.push_id!=pushId){
			return showToast({title:'此码无法核销'})
		}
		uni.navigateTo({
			url:'/'+path+"?id="+award_id+"&pushId="+pushId
		})
		},
		fail:(err)=>{
			console.log(err);
		}
	})
}