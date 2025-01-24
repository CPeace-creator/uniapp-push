const configCenter=require('uni-config-center/uni-id/config.json')
const {appid,appsecret:secret} = configCenter["mp-weixin"]["oauth"]["weixin"]
module.exports = {
	_before: async function () { // 通用预处理器
		let {data:{access_token}} = await uniCloud.request({
			url:"https://api.weixin.qq.com/cgi-bin/token",
			data:{
				grant_type:"client_credential",
				appid:appid,
				secret:secret
			}
		})
		this.accessToken=access_token
	},
	//获取小程序码
	getQRCode(){
		
	},
	//获取不限制的小程序码
	async getUnlimited(){
		let {data}=await uniCloud.request({
			url:"https://api.weixin.qq.com/wxa/getwxacodeunlimit",
			method:"POST",
			responseType:'buffer',
			data:{
				scene:"0"
			}
		})
		return "data:image/png;base64,"+data.toString('base64');
	},
	//获取小程序二维码
	createQRCode(){

	}
}
