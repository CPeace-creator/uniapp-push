import {
	getUUId,
	getFileExtension
} from './tools';
import dayjs from 'dayjs';
const SYSTEM_INFO = uni.getSystemInfoSync();

export const getStatusBarHeight = () => SYSTEM_INFO.statusBarHeight || 15;

export const getTitleBarHeight = () => {
	if (uni.getMenuButtonBoundingClientRect()) {
		let {
			top,
			height
		} = uni.getMenuButtonBoundingClientRect()
		return height + (top - getStatusBarHeight()) * 2
	} else {
		return 40;
	}
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
					uni.showLoading({
						mask: true,
						title: "上传中"
					})
					let index = 0;
					uniCloud.uploadFile({
						filePath,
						cloudPathAsRealPath: true,
						cloudPath: `raffle/${dayjs(Date.now()).format("YYYYMMDD")}/${getUUId()}.${getFileExtension(filePath)}`,
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