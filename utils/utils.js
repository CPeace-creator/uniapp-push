const SYSTEM_INFO =uni.getSystemInfoSync();

export const getStatusBarHeight= ()=> SYSTEM_INFO.statusBarHeight || 15;

export const getTitleBarHeight=()=>{
	if(uni.getMenuButtonBoundingClientRect()){
		let {top,height} = uni.getMenuButtonBoundingClientRect()
		return height+(top - getStatusBarHeight())*2
	}else{
		return 40;
	}
}

export const routeTo=(url,type='navigate')=>{
	if(type==='navigate'){
		uni.navigateTo({
			url
		})
	}else if(type==='redirectTo'){
		uni.redirectTo({
			url
		})
	}else if(type==='reLaunch'){
		uni.reLaunch({
			url
		})
	}else{
		return "错误信息";
	}
}


export const goBack=(back=1)=>{
	uni.navigateBack({back})
}