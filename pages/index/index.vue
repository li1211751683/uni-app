<template>
	<view>
		<!-- 搜索框区域 -->
		<view class="head">
			<image src="../../static/index/logo.jpg" mode="widthFix"></image>
			<view class="searchview">
				<input type="text" value="" placeholder="寻找商品" @focus="getsearch" />
			</view>
		</view>
		<!-- 快速分类导航 滚动视图 -->
		<scroll-view scroll-x class="quicknav">
			<view v-for="(item,index) in quicknav" :key="index" @click="changeTopMenu(index,item.id)">
				<text :class="index == topindex ? 'navactive' : '' ">{{item.catename}}</text>
			</view>
		</scroll-view>
		<!-- 轮播图 -->
		<swiper indicator-dots circular autoplay :interval="3000" :duration="1000">
			<swiper-item v-for="(item,index) in swipers" :key="index">
				<image :src="item.img" mode=widthFix></image>
			</swiper-item>
		</swiper>


		<!-- 功能导航 -->
		<view class="funnav">
			<view class="funnavrow" v-for="(item,index) in funNavList" :key="index" @click="tzcate(index)">
				<image :src="item.icon" mode="widthFix"></image>
				<text>{{item.name}}</text>
			</view>
		</view>


		<!-- 秒杀商品推荐区域 -->
		<view class="seckill">
			<!-- 秒杀左侧区域 -->
			<view class="leftseckill">
				<view class="title">
					<image src="../../static/index/xianshi.jpg" mode="widthFix"></image>
					<text>限时秒杀</text>
				</view>
				<view class="info">
					<text>每天零点场，好货抢不停</text>
				</view>
				<view>
					<countdown :startTime="startTime" :endTime="enTime" />
				</view>
				<image src="../../static/classify/1.jpg" mode="widthFix" class="goodimg"></image>
			</view>


			<!-- 秒杀右侧区域 -->
			<view class="rightseckill">
				<view class="top">
					<view class="topinfo">
						<text>品牌上新 <text style="background: #f33182;font-size: 28rpx;color: white;">折</text></text>
						<text>每天九点，抢大牌</text>
					</view>
					<image src="../../static/index/goods1.jpg" mode="widthFix"></image>
				</view>
				<view class="bottom">
					<view class="bottomgood">
						<text>每日十件</text>
						<text>只为您好选</text>
						<image src="../../static/index/goods1.jpg" mode="widthFix"></image>
					</view>
					<view class="bottomgood">
						<text>每日十件</text>
						<text>只为您好选</text>
						<image src="../../static/index/goods1.jpg" mode="widthFix"></image>
					</view>
				</view>
			</view>


		</view>
		<!-- 广告图片推送区域 -->
		<view class="gg">
			<image src="../../static/index/swiper1.jpg" mode="widthFix"></image>
		</view>
		<!-- 推荐商品区域 -->
		<view class="recommendgood">
			<!-- 推荐导航 -->
			<view class="recommendnav">
				<view :class="recommendIndex == index?'recommendactive':''" v-for="(item,index) in recommend" @click="recommendClick(index)">
					<text>{{item}}</text>
				</view>
				<!-- <view>
					<text>上新推荐</text>
				</view>
				<view>
					<text>所有商品</text>
				</view> -->
			</view>
			<view class="recommendlist">
				<view class="recommendrow" v-for="(item,index) in products" @click="TOdetail(item.id)">
					<image :src="item.img" mode="widthFix"></image>
					<view class="recommendrowinfo">
						<text>{{item.goodsname}}</text>
						<text>现价格： ￥{{item.market_price}}</text>
						<text>原价格：￥{{item.price}}</text>
						<text>
							立即抢购
						</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import countdown from "@/components/cz-countdown/cz-countdown.vue"
	let {
		format
	} = require('@/utils/tip');
	export default {
		components: {
			countdown
		},
		data() {
			return {
				startTime: '2020-01-01 00:00:00',
				enTime: '2020-02-01 00:00:00',
				skilldata: {},
				quicknav: [], //快速分类导航,
				topindex: 0,
				swipers: [],
				products: [], //热销、上新、所有商品数据
				recommend: ["热门推荐", "上新推荐", "所有商品"],
				recommendIndex: 0,
				funNavList: [{ //功能导航数据
						name: "限时抢购",
						icon: require("../../static/index/xiaohuoban.png")
					},
					{
						name: "积分商城",
						icon: require("../../static/index/jifentixicopy.png")
					},
					{
						name: "联系我们",
						icon: require("../../static/index/lianxiwomen.png")
					},
					{
						name: "商品分类",
						icon: require("../../static/index/-shangpinfenlei-gai.png")
					}
				],
			}
		},
		onLoad() {
			// 获取分类数据
			this.getCategory();
			// 获取轮播图
			this.getBanner();
			// 获取秒杀数据
			this.getSkill()



		},
		onShow() {
			this.getProducts();
		},
		methods: {
			getCategory() {
				this.$http({
						url: "/api/getcate"
					})
					.then(res => {
						this.quicknav = res.data.list
					})
			},
			changeTopMenu(index, id) {
				this.topindex = index;
				// 跳转到商品列表页面
				uni.navigateTo({
					url: '../product/product?type=1&id=' + id
				})
			},
			getBanner() {
				this.$http({
						url: '/api/getbanner'
					})
					.then(res => {
						let data = res.data.list

						data.forEach(item => {
							item.img = this.$URL + item.img
						})
						this.swipers = data;

					})
			},
			tzcate(index) {

				if (index == 3) {
					uni.navigateTo({
						url: "../classify/classify"
					})
				}
			},
			getProducts() {
				this.$http({
						url: '/api/getindexgoods'
					})
					.then(res => {
						let products = res.data.list[this.recommendIndex].content
						products.forEach(item => {
							item.img = this.$URL + item.img
						})
						this.products = products


					})
			},
			recommendClick(index) {
				this.recommendIndex = index
				this.getProducts(index)
			},
			TOdetail(id) {
				uni.navigateTo({
					url: "../details/details?id=" + id
				})

			},
			// 定义获取秒杀数据方法
			getSkill() {
				this.$http({
						url: '/api/getseckill'
					})
					.then(res => {
						let data = res.data.list[0];
						// 处理商品图片路径
						data.img = this.$URL + data.img;
						// 赋值
						this.skilldata = data
						// 处理倒计时  endtime - nowtime
						this.skillTime(data.endtime)
					})

			},
			// 定义处理倒计时方法
			skillTime(endtime) {
				this.startTime = format(new Date())
				this.endTime = format(parseInt(endtime))
			}
		}
	}
</script>

<style>
	@import url("../../common/css/index.css");
</style>
