<template>
	<view class="container" v-if="buffer">
		<view class="top">
			<scroll-view class="scroll-view_H" scroll-x="true" :scroll-left="item.left" v-for="(item,index) in cartList" :key="index">
				<view class="cartInfo" id="demo1">
					<!-- 明日来写购物车基本信息 -->
					<view class="cartInfochild">
						<!-- 选择框 -->
						<view class="cartInfo_switch common">
							<!-- 点击当前商品 -->
							<switch type="checkbox" :checked="item.status"  @change="changeOne($event,index)"/>
						</view>
						<!-- 图片 -->
						<view class="cartInfo_image common">
							<image :src="item.img" mode="widthFix"></image>
						</view>

						<!-- 信息 -->
						<view class="cartInfo_info">
							<label style="font-size: 26rpx;">{{item.goodsname}}</label>
							<label style="font-size: 24rpx; color: #ccc;">规格：不错的商品</label>
							<label style="color: red;">￥{{item.price}}</label>
						</view>
						<!-- 加减数量 -->
						<view class="cartInfo_num">
							<view class="cartInfo_num_child">
								<label @click="changeNum(1,index,item.id)">-</label>
								<label>{{item.num}}</label>
								<label @click="changeNum(2,index,item.id)">+</label>
							</view>
						</view>
					</view>

				</view>
				<view class="cartDel" id="demo2" @click="delCart(index,item.id)">
					<label for="">删除</label>
				</view>
			</scroll-view>
		</view>

		<!-- 底部 -->
		<view class="foot">
			<view class="footd1">
				<switch type="checkbox" :checked="allStatus" @change="changeAll" />
				<label>全选</label>
			</view>
			<view class="footd2">
				<view class="footd2sp1">总计：<label style="color: red;">{{jisuan.countMoney}}</label></view>
				<label class="footd2sp2">不含运费，已优惠￥0.00</label>
			</view>
			<!-- 跳到提交订单，结算页面 -->
			<view class="footd3" @click="jiesuan()">
				<!-- 被选中的商品的个数 -->
				<label>去结算({{jisuan.countMum}}件)</label>
			</view>
		</view>

	</view>
	<view v-else>
		<image src="/static/kk.jpg" mode="widthFix"></image>
	</view>
</template>

<script>
	let app = getApp()
	let {
		isLogin,
		tip
	} = require('../../utils/tip.js')
	export default {
		data() {
			return {
				scrollLeft: 0, //默认横向滚动 0,
				buffer: true, //检测购物车是否有数据
				cartList: [], //初始化购物车数据
				userinfo: {}, //初始化用户数据
				allStatus: true, //全选状态
			}
		},
		// 页面显示时
		onShow() {
			// 判断用户登录是否有效
			if (!app.globalData.loginStatus) {
				isLogin();
				return;
			}
			// 从缓存中获取用户基本数据
			this.userinfo = uni.getStorageSync('userinfo')
			// 组装请求header头
			app.globalData.header.authorization = this.userinfo.token;
			this.header = app.globalData.header
			this.getCateList()

		},

		methods: {
			getCateList() {
				this.$http({
						url: "/api/cartlist",
						header: this.header,
						data: {
							uid: this.userinfo.uid
						}
					})
					.then(res => {
						let data = res.data;
						if (data.code == 200) {
							// 需要处理数据
							let cartData = data.list;
							// 判断数据是否为空
							if (cartData == null) {
								this.buffer = false;
								return;
							} else {
								this.buffer = true;
							}
							cartData.forEach((item) => {
								item.img = this.$URL + item.img;
								item.status = true;
								item.left = 0
							})
							this.cartList = cartData;
							
						} else if (data.code == 403) {
							isLogin();
						} else {
							tip('请刷新重试！')
						}
					})
			},
			changeNum(type, index, id) {
				if (type == 1) {
					if(this.cartList[index].num ==1 ){
						tip('请左滑删除');return;
					}
					--this.cartList[index].num
				} else {
					++this.cartList[index].num;
				}

				this.$http({
						url: "/api/cartedit",
						method: "POST",
						header: this.header,
						data: {
							id,
							type
						}
					})
					.then(res => {
						if (res.data.code == 403) {
							isLogin() //登录提示
						} else if (res.data.code != 200) {
							tip('请重试！')
						}
					})
			},
			// 单选操作
			changeOne(e,index){
				// 修改选中数据的状态
				this.cartList[index].status = e.detail.value
				this.allStatus = this.cartList.every(item=>item.status)
				
			},
			changeAll(e){				
				// 给全选状态重新赋值
				this.allStatus = e.detail.value;
				this.cartList.forEach((item)=>{
					item.status = this.allStatus;
				})
				
			},
			// 删除
			delCart(index,id){
				uni.showModal({
					title:"删除提示",
					content:"是否要删除",
					success:res=>{
						if(res.confirm){
							// 执行删除
							this.$http({
								url:'/api/cartdelete',
								method:'POST',
								header:this.header,
								data:{id}
							})
							.then(res=>{
								if(res.data.code ==200){
									this.cartList.splice(index,1)
								}else if(res.data.code == 403){
									isLogin()//登录提示
								}else{
									tip('请重试！')
								}
							})
						}
					}
				})
			},
			jiesuan(){
				// 组装订单确认需要展示购物车数据
				let order = [];
				this.cartList.forEach((item)=>{
					if(item.status){
						order.push(item)
					}
				})
				uni.navigateTo({
					url:'../confirm/confirm?params='+JSON.stringify(order) 
				})
			},
			
		},
		computed:{
			jisuan(){
				var countMoney = 0;//总支付金额
				var countMum = 0;//购买商品数量
				var cartNum = 0;//购物车右上角角标数量
				this.cartList.forEach((item)=>{
					if(item.status){
						countMoney += parseFloat(item.price) * parseInt(item.num) 
						countMum+=1;
					}
					cartNum+=parseInt(item.num);
				})
				if(countMum>0){
					uni.setTabBarBadge({
						index:1,
						text:cartNum.toString()
					})
					this.buffer=true;
				}else{
					uni.removeTabBarBadge({
						index:1
					})
					// this.buffer=false;
				}
				return {countMoney,countMum}
			}
		},
	}
</script>

<style>
	@import url("../../common/css/cart.css");

	.cartInfo_image_img {
		width: 120rpx;
		height: 120rpx;
	}
</style>
