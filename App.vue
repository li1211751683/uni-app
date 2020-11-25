<script>
	// 项目的根组件
	export default {
		// 定义公共的全局变量  getapp（）获取实例
		globalData: {
			// 记录登录状态
			loginStatus: true, //true:登录有效  false:失效
			header: {
				"content-type": "application/json",
				"authorization": ""
			},
		},
		onLaunch() {
			// 检测用户是否登录
			let userinfo = uni.getStorageSync("userinfo") || "";
			if (userinfo == "") {
				uni.setTabBarItem({
					index: 2,
					text: "未登录"
				})
				this.globalData.loginStatus = false
			} else { //登录数据是否有效  判断token
				this.globalData.header.authorization=userinfo.token;
				this.$http({
					url:"/api/checktoken",
					header:this.globalData.header
				})
				.then(res=>{
					if(res.data.code !=200){
						uni.setTabBarItem({
							index: 2,
							text: "未登录"
						})
						this.globalData.loginStatus = false
					}
				})
			}
			console.log(this.globalData.loginStatus)
		},
	}
</script>

<style>
	/*每个页面公共css */
</style>
