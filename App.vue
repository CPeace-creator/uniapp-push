<script setup>
import uniIdPageInit from '@/uni_modules/uni-id-pages/init.js';
import {onLaunch} from '@dcloudio/uni-app'
onLaunch(async()=>{
	console.log('App Launch')
	await uniIdPageInit()
})
</script>

<style>
view,text{
	box-sizing: border-box;
}
</style>
