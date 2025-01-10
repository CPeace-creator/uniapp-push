//创建唯一id
export function getUUId(){
	return Date.now().toString(36)+'-'+Math.random().toString(36).substring(3,9)
}

//获取文件后缀名
export function getFileExtension(filePath){
	const file = filePath.split('.').pop()
	return file
}