

// 提示是否登录方法
const login=()=>{
	uni.showModal({
		title:'登录过期提示',
		content:"是否要登录",
		success:res=>{
			if(!res.cancel){
				uni.navigateTo({
					url:'../login/login'
				})
			}
		}
	})
}
const cartlogin=()=>{
	uni.showModal({
		title:'登录过期提示',
		content:"是否要登录",
		success:res=>{
			if(res.cancel){
				uni.switchTab({
					url:'../index/index'
				})
			}else{
				uni.navigateTo({
					url:'../login/login'
				})
			}
		}
	})
}

 const format=(shijian)=>{
	   let date = new Date(shijian)
		var y = date.getFullYear(); 
		var m = date.getMonth() + 1;  
			m = m < 10 ? ('0' + m) : m;  
		var d = date.getDate();  
			d = d < 10 ? ('0' + d) : d;  
		var h = date.getHours();  
			h=h < 10 ? ('0' + h) : h;  
		var minute = date.getMinutes();  
			minute = minute < 10 ? ('0' + minute) : minute;  
		var second=date.getSeconds();  
			second=second < 10 ? ('0' + second) : second;  
		return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second; 
}

const isLogin = ()=>{
	uni.showModal({
		title:'登录失效提示',
		content:"是否要登录",
		success:res=>{
			if(res.confirm){
				uni.navigateTo({
					url:'../login/login'
				})
			}else{
				let pages = getCurrentPages()
				if(pages[pages.length-1].route == 'pages/cart/cart'){
					uni.reLaunch({
						url:'../index/index'
					})
				}
			}
		}
	})
}
// 提示方法
const  tip=(title,icon='none')=>{
	uni.showToast({
		title,
		icon
	})
}

module.exports = {
	login,
	cartlogin,
	format,
	isLogin,
	tip
}