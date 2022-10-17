<template>
	<view class="index">
		<!-- 这种做法很别扭，换了一个做法 -->
        <!-- <nav-bar v-if="navBarShowTag"> -->
			 <!-- 选项卡 -->
		<!-- 	 <view class="tabs-box">
			 	<view class="one-nav" :class="currentSwiperIndex==0?'nav-actived':''"  @tap="swiperChange(0)">推荐</view>
			 	<view class="one-nav" :class="currentSwiperIndex==1?'nav-actived':''"  @tap="swiperChange(1)">资讯</view>
			 </view>
		 </nav-bar> -->
		 
		<!-- 页面导航部分 -->
		<view class="header-box">

			<!-- 轮播图部分 -->
			<swiper class="swiper" :indicator-dots="false" :autoplay="true" :interval="2500" :duration="500">
				 <swiper-item v-for="(item,index) in swiperAdList" :key="index">
					 <navigator open-type="navigate" :url="'/pages/webview/webview?url='+item.data.link">
						 <image class="banner-swiper-img" :src="item.data.image" mode=""></image>
					 </navigator>
				 </swiper-item>
				<!-- 	 <swiper-item>
						 <navigator open-type="navigate" url="/pages/webview/webview?url=http://baidu.com"  >
							<image class="banner-swiper-img" src="@/static/sec.png" mode=""></image>
						 </navigator>
					 </swiper-item> -->
				<!-- 	 <swiper-item>
						 <navigator open-type="navigate" url="/pages/webview/webview?url=http://baidu.com"  >
							 <image class="banner-swiper-img" src="@/static/thid.png" mode=""></image>
						 </navigator>
					  </swiper-item> -->
			</swiper>
			<!-- 遮罩部分 -->
			<image class="crile" src="@/static/crile.png" mode="aspectFill"></image>
			
			<!-- 两个按钮 -->
			<view class="card-header">
				<view class="card-one card-left" @tap="gotoTab('/pages/feeds/feeds')">
					<image class="img" src="@/static/coffee.png" mode="aspectFill" />
					<view class="iright">
						<view class="title">精彩动态</view>
					</view>
				</view>
				<view class="card-one card-right" @tap="gotoTab('/pages/me/me')">
					<image class="img" src="@/static/ran.png" mode="aspectFill" />
					<view class="iright">
						<view class="title">个人中心</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 选项卡 -->
		<view class="isticky">
			<u-sticky offset-top="-110" :enable="true" >
				<view class="tabs-box">
					<view class="one-nav" :class="currentSwiperIndex==0?'nav-actived':''"  @tap="swiperChange(0)">推荐</view>
					<view class="one-nav" :class="currentSwiperIndex==1?'nav-actived':''"  @tap="swiperChange(1)">资讯</view>
				</view>
			</u-sticky>
		</view>
	
		<!-- 滑块模块-->
		<swiper class="swiper-box" :style="'height:'+swiperSliderHeight" :current="currentSwiperIndex" @animationfinish="swiperSlider">
		     <!-- 推荐feed流 -->
			 <!-- 滑块 --> 
			<swiper-item class="swiper-item sns-now">
				<view class="feeds-box" style="column-gap: 10px;column-count:2;">
					<!-- 组件的使用 -->
					<sns-waterfall v-model="feedsList" ref="waterfall">
						<template v-slot:left="{leftList}">
							<view class="feed-one" v-for="(item, index) in leftList" :key="index">
								<navigator open-type="navigate" :url=" '/subpages/feedinfo?id='+ item.id">
									<image class="feed-img" :src="item.cover" mode="widthFix" :lazy-load="true" />
									<view class="u-line-2 feed-title" v-if="!!item.feed_content">{{ item.feed_content }}</view>
									<view class="feed-info">
										<view class="iview">
											<image class="avatar" :src=" item.avatar" />
											<text class="name u-line-1">{{ item.name }}</text>
										</view>
										<view class="iview">
											<view class="ilike" @tap.stop="clickLove(item)">
												<image v-if="item.has_like" src="@/static/lover.png" class="micon" />
												<image v-else src="@/static/love.png" class="micon" />
												<text class="love-count" v-if="item.like_count>0">{{ item.like_count }}</text>
											</view>
										</view>
									</view>
								</navigator>
							</view>
						</template>
						<template v-slot:right="{rightList}">
							<view class="feed-one" v-for="(item, index) in rightList" :key="index">
								<navigator open-type="navigate" :url="'/subpages/feedinfo?id='+ item.id">
									<image class="feed-img" :src="item.cover" mode="widthFix" :lazy-load="true" />
									<view class="u-line-2 feed-title" v-if="!!item.feed_content">{{ item.feed_content }}</view>
									<view class="feed-info">
										<view class="iview">
											<image class="avatar" :src=" item.avatar" />
											<text class="name u-line-1">{{ item.name }}</text>
										</view>
										<view class="iview">
											<view class="ilike" @tap.stop="clickLove(item)">
												<image v-if="item.has_like" src="@/static/lover.png" class="micon" />
												<image v-else src="@/static/love.png" class="micon" />
												<text class="love-count" v-if="item.like_count>0">{{ item.like_count }}</text>
											</view>
										</view>
									</view>
								</navigator>
							</view>
						</template>
					</sns-waterfall> 
                </view>
				<view class="" v-show="feedshow">
					<text>我是有底线的啦～</text>
				</view>
			</swiper-item>
			
			<!-- 资讯列表实现 -->
			<swiper-item class="swiper-item sns-news">
				<view v-for="(item, index) in newsList" :key="index">
					<navigator class="one-new" open-type="navigate" :url=" '/subpages/newinfo?id=' + item.id">
						<view class="left">
							<view class="title u-line-2">{{item.title}}</view>
							<view class="uinfo">
								<view class="iview">
									<view class="utime">
										<text class="name">{{ item.author }}</text>
									</view>
								</view>
								<text class="uptime">{{ item.created_at | formatterTime1 }}发布</text>
							</view>
						</view>
						<view class="right">
							<image class="pic" mode="aspectFill" :src="item.cover" />
						</view>
					</navigator>
				</view>
				<view class="" v-show="infoshow">
					<text>我是有底线的啦～</text>
				</view>
			</swiper-item>
		</swiper>
		
		<!-- UGC上传 -->
		<gotoShare />
		
	  	<!-- 登陆组件 -->
	  	<login ref="login"  v-if="!loginState"/>
	</view>
</template>

<script>
	import {formatterDate} from "@/utils/dateUtil.js"
	import snsWaterfall from "../../components/sns-waterfall.vue" 
	import { mapState } from 'vuex'
	import todoLoveMinxin from "@/mixins/todoFeed.js"
	export default{
		mixins:[todoLoveMinxin],
		data() {
			return {
				 //Banner广告
				 swiperAdList: [],
				 
				 //推荐、资讯滑动id
			     currentSwiperIndex:0,
				 
				 //动态列表
				 feedsList:[],
				 
				 //资讯列表
				 newsList:[],
				
				 //轮播器的高度
				 swiperSliderHeight:"",
				 
				 //瀑布流高度
				 swiperSliderFeedsHeight:"0px",
				 
				 //滑块高度
				 swiperSliderNewsHeight:"0px",
				 
				 //默认隐藏
				 navBarShowTag: false,
				 
				 //记录推荐滚动所在的位置
				oldFeedsScrollTop:0,
				
				 //记录资讯滚动所在的位置
				oldNewsScrollTop:0,
				
				feedshow:false,
				infoshow:false,
				
				// 不知道什么问题？？？
				afterId: null
			}
		},
		
		components: {
			snsWaterfall,
		},
		
		computed:{
			...mapState(['loginState'])
		},
		
		filters: {
		    formatterTime1(val) { 
			 
			 //val: 时间戳
		      if (!val) return null
		      const t = new Date(val)
		      return formatterDate(t, 'yyyy-MM-dd hh:mm:ss') //日期时间
		    },
		    formatterTime2(val) {
		      if (!val) return null
		      const t = new Date(val)
		      return formatterDate(t, 'yyyy-MM-dd') //日期格式
		    },
		    formatterTime3(val) {
		      if (!val) return null
		      const t = new Date(val)
		      return formatterDate(t, 'yyyy年MM月dd日') //日期格式年月日
		    }
		},
		
		async onLoad() {
			// 加载时就获得广告的数据
			this.getAds()
			
			// 加载时就获得动态的数据
			this.getFeeds()
			
			// 加载时就获得资讯的数据
			this.getNews()
			
			// 用户登录完成后，触发行为
			uni.$on('indexUserLogin',()=>{
				this.currentSwiperIndex=0
				this.feedsList=[]
				this.$refs.waterfall.clear()
				this.getFeeds()
			})
			
			// 用户退出后的触发的行为操作
			uni.$on('indexUserLogout',()=>{
				this.currentSwiperIndex=0
				this.feedsList=[]
				this.$refs.waterfall.clear()
				this.getFeeds()
			})
			
			
			uni.$on("indexFeedsUpdate", ()=>{
				this.currentSwiperIndex = 0
				this.feedsList = []
				this.$refs.waterfall.clear()
				this.getFeedsList()
				})
						
						// 个人中心删除一条动态后，触发更新首页数据
			uni.$on("indexFeedRemove", fid =>{
				this.$refs.waterfall.remove(fid);
			})
			
			// 用户点赞后触发的行为
			uni.$on('indexFeedLoveChange',item => {
				this.$refs.waterfall.modify(item.id,"like_count",item.like_count);
				this.$refs.waterfall.modify(item.id,"has_like",item.has_like);
			})
		},
		
		onPageScroll(event) {
			if(this.currentSwiperIndex===0){
				this.oldFeedsScrollTop=event.scrollTop
			}else if(this.currentSwiperIndex===1){
				this.oldNewsScrollTop=event.scrollTop
			}
			event.scrollTop>220?this.navBarShowTag=true:this.navBarShowTag=false
		},
		
		onPullDownRefresh() {
			this.getAds()
			if(this.currentSwiperIndex==0){
				
				// 加载时就获得广告的数据
				this.getFeeds()
				
			}else{
				this.getNews()
			}
			// console.log("下拉了")
		},
		
		onReachBottom() {
			if(this.currentSwiperIndex==0){
				// 加载时就获得广告的数据
				this.getFeeds()
			}else{
				this.getNews()
			}
			// console.log("刷新了")
		}, 
		
		methods: {
			// 点击切换方法
			swiperChange(index){
				this.currentSwiperIndex=index;
				if(index===0){
					this.swiperSliderHeight=this.swiperSliderFeedsHeight
					uni.pageScrollTo({
						duration:0,
						scrollTop:this.oldFeedsScrollTop
					})
				}else{
					this.swiperSliderHeight=this.swiperSliderNewsHeight
					uni.pageScrollTo({
						duration:0,
						scrollTop:this.oldNewsScrollTop
					})
				}
			},
			// 滑动切换
			swiperSlider(event){
				let index =event.detail.current
				this.currentSwiperIndex=index
				if(index===0){
					this.swiperSliderHeight=this.swiperSliderFeedsHeight
					uni.pageScrollTo({
						duration:0,
						scrollTop:this.oldFeedsScrollTop
					})
				}else{
					this.swiperSliderHeight=this.swiperSliderNewsHeight
					uni.pageScrollTo({
						duration:0,
						scrollTop:this.oldNewsScrollTop
					})
				}
			},
			gotoTab(url){
				uni.switchTab({
			    	url
				})
			},
			async getAds(){
				this.swiperAdList = await this.$u.api.getAdvert();
				// console.log('获得广告是',this.swiperAdList)
			},
			
			async getFeeds(){
				let feeds = await this.$u.api.getFeeds({
					after:this.afterId,
				});
				
                // console.log(feeds)
				let feedsListorg=feeds.feeds.map(item =>{
					// if(item.images.length){
					// 	item.cover=this.BaseFileURl +item.images[0].file
					// }
					// return JSON.parse(JSON.stringify(item))
					return{
						...item,
						// 获取封面,有些 images没有 ，所以判断这个的长度
						cover:item.images.length? this.BaseFileURl +item.images[0].file:'@/static/noCover.png',
						
						// 获取头像，强制转化成bool值出来
						avatar: !!item.user.avatar?item.user.avatar.url:'@/static/nopic.png',
						
						// 获取姓名
						name:item.user.name
					}
				});
				this.feedsList.push(...feedsListorg);
				this.afterId=this.feedsList[this.feedsList.length - 1].id
			
				// this.commintsList.push(...res.comments);
				// this.afterId = this.commintsList[this.commintsList.length - 1].id;
				//  console.log("复值给瀑布流commintsList的数据",this.commintsList)
				
				if(this.feedsList.length==0){
						this.feedshow=true
				}    
				
				setTimeout(()=> {
					// 全局计算页面的高度
					uni.$on("swiperHeightChange",height=>{
						// console.log('计算的高度为'+ height)
						this.swiperSliderHeight = height
						this.swiperSliderFeedsHeight = height
					})
				},2000)

			},
			async getNews(){
				let news = await this.$u.api.getNews({
					after: this.afterId
				})
				let newsListorg = news.map(item => {
					return {
						...item,
						cover : this.BaseFileURl + item.image.id,
					}
				})
				
				console.log('获得新闻列表是',newsListorg)
				this.newsList.push(...newsListorg);
				this.afterId=this.newsList[this.newsList.length - 1].id
							
				// this.commintsList.push(...res.comments);
				// this.afterId = this.commintsList[this.commintsList.length - 1].id;
				//  console.log("复值给瀑布流commintsList的数据",this.commintsList)
				
				if(this.newsList.length==0){
						this.infoshow=true
				}    
				
				
				this.swiperSliderNewsHeight=(this.newsList.length*95 + 100)+"px"
			},
			
			remove(id){
				this.$refs.uWaterfall.remove(id);
			},
			
			clear(){
				this.$refs.uWaterfall.clear();
			}	
		},
	}
</script>

<style lang="scss" scoped>
	// 
	#sns {
		background-color: #f1f1f1;
	}
	
	// 推荐、咨询 按钮样式
	.isticky{
		width: 750upx;
		height: 100upx;
		left: 0;
		.tabs-box {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items:center;
			margin: 0upx;
			width: 750upx;
			height: 100upx;
			background-color: #FFFFFF;
			.one-nav {
				width: 120upx;
				color: #9B9B9B;
				font-size: 36upx;
				text-align: center;
				font-weight: blod;
				&.nav-actived {
					color: #0050FF;
				}
			}
		}
	}

	.header-box {
		position: relative;
		left: 0;
		height: 500upx;
		background-color: #f1f1f1;
		z-index: 1;
	
		// 广告位轮播器相关样式
		.swiper {
			width: 750upx;
			height: 400upx;
			position: absolute;
			left: 0;
			top: 0;
			text-align: center;
			z-index: 1;
	
			.banner-swiper-img {
				width: 750upx;
				height: 400upx;
				box-shadow: 0 0 2px 0 rgb(188, 188, 188);
			}
		}
	
		.crile {
			width: 750upx;
			height: 50upx;
			position: absolute;
			left: 0;
			top: 355upx;
			z-index: 9;
		}
	
		// 新鲜事 活动墙 按钮样式
		.card-header {
			position: absolute;
			left: 0;
			top: 320upx;
			height: 160upx;
			z-index: 99;
			width: 710upx;
			margin-left: 20upx;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			align-content: center;
	
			.card-one {
				width: 328upx;
				height: 96upx;
				border-radius: 49upx;
				background-color: #fff;
				margin: 0 10upx;
				box-shadow: 0 0 2px 0 rgb(188, 188, 188);
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: flex-start;
				align-items: center;
				align-content: center;
	
				.img {
					width: 44upx;
					height: 44upx;
					margin-left: 50upx;
				}
	
				.iright {
					margin-left: 30upx;
					text-align: left;
					color: #888;
	
					.title {
						font-size: 30upx;
						color: #001432;
					}
	
					.iview {
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						justify-content: space-between;
						align-items: center;
						align-content: center;
						font-size: 20upx;
						margin-top: -5upx;
					}
				}
			}
		}
	
		// 推荐、咨询 按钮样式
		.tabs-box {
			width: 750upx;
			position: absolute;
			z-index: 1;
			left: 0;
			top: 400upx;
			display: flex;
			flex-direction: row;
			justify-content: center;
	
			.one-nav {
				height: 80upx;
				width: 110upx;
				color: #9B9B9B;
				font-size: 36upx;
				text-align: center;
				font-weight: blod;
	
				&.nav-actived {
					color: #0050FF;
				}
			}
		}
	}
	
	// 此刻 栏目样式\
	.swiper-box {
		background-color: #f1f1f1;
		padding: 20upx 0 40upx;
	}
	
	.sns-now {
	
		// 动态相关瀑布流样式
		.feeds-box {
			width: 735upx;
			margin-left: 13upx;
			padding-bottom: 20upx;
	
			.feed-one {
				width: 358upx;
				margin-bottom: 12upx;
				background-color: #FFF;
				border-radius: 20upx;
	
				position: relative;
	
				.feed-img {
					width: 358upx;
					height: 300upx;
					border-radius: 10upx;
				}
	
				.feed-title {
					width: 350upx;
					margin-top: 15upx;
					margin-left: 10upx;
					font-size: 28upx;
					line-height: 40upx;
					color: #001432;
					text-align: left;
				}
	
				.feed-info {
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					justify-content: space-between;
					align-items: center;
					align-content: center;
					margin-top: 10upx;
					font-size: 20upx;
					color: #666;
					padding: 0 10upx 16upx;
	
					.iview {
						display: flex;
						flex-direction: row;
						flex-wrap: nowrap;
						justify-content: space-between;
						align-items: center;
						align-content: center;
	
						.ilike {
							display: flex;
							flex-direction: row;
							flex-wrap: nowrap;
							justify-content: space-between;
							align-items: center;
							align-content: center;
							height: 60upx;
							padding: 0 10upx;
							background-color: #FFFFFF;
						}
					}
	
					.avatar {
						margin-right: 10upx;
						height: 40upx;
						width: 40upx;
						border-radius: 50%;
						border: 1upx solid #eee;
					}
	
					.name {
						max-width: 120upx;
						color: #757474;
					}
	
					.micon {
						width: 32upx;
						height: 28upx;
					}
	
					.love-count {
						padding-left: 10upx;
						color: #757474;
					}
				}
			}
		}
	}
	
	// 轮播页面 资讯
	.sns-news {
		background-color: #fff;
		width: 750upx;
	
		.one-new {
			width: 700upx;
			height: 74px;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-around;
			align-items: flex-start;
			align-content: center;
			padding-bottom: 10px;
			padding-top: 10px;
			padding-left: 25upx;
			padding-right: 25upx;
			border-bottom: 1px solid #f1f1f1;
	
			.left {
				width: 490upx;
				height: 140upx;
				text-align: left;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: flex-start;
	
				.title {
					font-size: 30upx;
					line-height: 48upx;
					color: #001432;
					margin-top: 20upx;
				}
	
				.uinfo {
					width: 490upx;
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					justify-content: space-between;
					align-items: center;
					align-content: center;
					margin-top: 10upx;
					font-size: 20upx;
					color: #999;
	
					.utime {
						font-size: 24upx;
	
						.name {
							max-width: 120upx;
							color: #777;
						}
					}
				}
			}
	
			.right {
				width: 120upx;
	
				.pic {
					width: 120upx;
					height: 120upx;
					margin-top: 20upx;
					border-radius: 6upx;
				}
			}
		}
	}      
</style>