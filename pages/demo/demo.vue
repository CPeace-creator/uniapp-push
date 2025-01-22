<template>
	<view class="demo" v-for="(item,index) in menu" :key="item.id">
		<view class="text">
			{{item.name}}
		</view>
		<view class="yuan">{{convertToYuan(item.price)}}元</view>
		<uv-number-box :min="0" v-model="item.number" @change="changeNumber"></uv-number-box>
	</view>
	<view class="count">
		<text>总数{{count}}</text>
		<text>总价格{{sum}} 元</text>
	</view>
</template>

<script setup>
import {ref,computed, nextTick} from "vue"
const sendObj=uniCloud.importObject("demo-push")
const menu=ref([
	{id:1,name:"羊肉串",price:150,number:1},
	{id:2,name:"鸡翅2",price:150,number:2},
	{id:3,name:"牛肉串",price:150,number:3},
	{id:4,name:"烤面包",price:150,number:4},
])
const convertToYuan=(fen)=> {
    if (isNaN(fen)) {
        throw new Error("输入的值必须是数字！");
    }
    return fen / 100;
}
const count=computed(()=>{
	let count=0
	menu.value.map(item=>{
		count+=item.number
	})
	return count
})
const sum=computed(()=>{
	let count=0
	menu.value.map(item=>{
		count+=convertToYuan(item.price) * item.number
	})
	return count
})
uni.onPushMessage(res=>{
	let {payload:{menuData}}=res.data
	menuData.forEach(item=>{
		const index=menu.value.findIndex(menuItem=>menuItem.id===item.id)
		if(index!==-1){
			menu.value[index].number=item.number
		}
	})
})
const changeNumber=()=>{
	nextTick(()=>{
		let arrs = menu.value.map(item => ({
		    id: item.id, 
		    number: item.number
		}))
		sendObj.sendMsg(arrs)
	})
}
</script>

<style lang="scss" scoped>
.demo{
	display: flex;
	justify-content: space-around;
	align-items: center;
	margin-bottom: 50rpx;
	border-bottom: 1px solid #666;
	.text{
		margin: 50rpx 0;
	}
}
</style>
