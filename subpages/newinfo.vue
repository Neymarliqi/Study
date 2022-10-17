<template>
	<view v-if="getRequestOk">
		<!-- 顶部导航 -->
		<uni-nav-bar backState="2000" fontColor="#FFF" :titleCenter="false" type="transparent">
			<view slot="left">
						<image class="hicon" src="/static/home.png" mode="aspectFit" @tap="goHome" />
					</view>
		</uni-nav-bar>
		<uni-nav-bar v-if="navBarShow" backState="1000" :titleCenter="false">{{ newInfo.cutTitle }}</uni-nav-bar>
		
		<!-- 顶部毛玻璃背景图
		<!-- 可选值 xs s m l xl -->
		<pic-blur :params="{
			 width:'750rpx',
			 height:'520rpx',
			 image: newInfo.cover,
			 blur:'xs'
		}"></pic-blur> 
		
		<view class="model">
			
			<!-- 标题 -->
			<view class="mtitle">{{newInfo.title}}</view>
				<view class="info-user">
					<view class="info">
						<text>{{ newInfo.author }} {{newInfo.created_at|formatterTime2}} 发布 {{ newInfo.views_count }}阅读</text>
					</view>
				</view>
			</view>
			
			<!-- 资讯详情 -->
			<view class="info-content">
				<html-parse :content="newInfo.content" />
			</view>
			
					<!-- 作者信息 -->
			<view class="info-header">
				<text class="send">{{newInfo.created_at|formatterTime3}}发布 </text>
				<text>{{ newInfo.views_count }}阅读</text>
			</view>

		<view class="line" />
	
		<comment :oneInfo="newInfo"  type="info" v-if="commentshow" ref="comment" />
	</view>
</template>

<script>
	// 引入富文本解析组件
	import htmlParse from "@/components/html-parse/parse.vue";
	// 引入毛玻璃组件
	import picBlur from "@/components/pic-blur/pic-blur.vue";
	// 引入顶部导航
	import uniNavBar from "@/components/uni-nav-bar/index.vue"
	// 引入时间处理的文件
	import {formatterDate} from "@/utils/dateUtil.js"
	// 评论插件
	import comment from '@/components/comment.vue'
	
	export default{
		data(){
			return{
				newInfo:{},
				navBarShow:false,
				getRequestOk:true,
				typeinfo:'info',
				commentshow:false,
			}
		},
		components: {
			htmlParse,
			picBlur,
			uniNavBar,
			comment
		},
		// 时间过滤器
		filters: {
		    formatterTime1(val) { // val: 时间戳
		      if (!val) return null
		      const t = new Date(val)
		      return formatterDate(t, 'yyyy-MM-dd hh:mm:ss') // 日期时间
		    },
		    formatterTime2(val) {
		      if (!val) return null
		      const t = new Date(val)
		      return formatterDate(t, 'yyyy-MM-dd') // 日期格式
		    },
		    formatterTime3(val) {
		      if (!val) return null
		      const t = new Date(val)
		      return formatterDate(t, 'yyyy年MM月dd日') // 日期格式年月日
		    }
		},
		
		onPageScroll(event) {
			if(event.scrollTop > 100){
				this.navBarShow =true
			}else{
				this.navBarShow = false
			}
		},
		onReachBottom(){
			// 这个是到底部，父组件调用子组件里面的方法，这是其中一种形式
			// 组件中 写好ref= “名字”，然后 this.$refs.名字.子组件的方法
			this.$refs.comment.getCommentsList()
		},
		async onLoad(params){
			let res = await this.$u.api.getNewInfo(params).catch(res => {
				// 返回来的错误数据，也需要拿着，用catch的方法
				// 用.then是不行的，然后返回错误信息
				return res;
				                  
			})
			// console.log('获取结果是',res)
			
			if(res){
				this.commentshow=true
			}
			// 这一部分是做什么的呢？？？
			// 正则解析后，输出HTML结构
			// let cp = res.content.replace(/@!\[(\d*).jpg\]\((\d*)\)/g,"<img src='" +this.BaseFileURL +'$2' + "' />")
			let cp = res.content.replace(/@!\[.*\]\((\d*)\)/g, "<img src='" + this.BaseFileURL + '$1' + "' />")
			// 匹配检索换行符号，实现换行目标
			cp = cp.replace(/\s\D\s/g, "<p></p>")
						
			this.newInfo = {
				...res,
				cutTitle: res.title.length > 11 ? res.title.substring(0, 11) + "..." : res.title,
				cover : this.BaseFileURl + res.image.id,
				userId: res.user_id,
				content: cp,
				views_count: res.hits
			}
			this.getRequestOk=true
			// console.log('拼接后的内容是',this.newInfo)
		},
	
		methods: {
		   
		}	
	}
</script>

<style lang="scss" scoped>
	@import url("@/components/u-parse/u-parse.css");
	.hicon{
		height: 36upx;
		width: 36upx;
		padding-left: 30upx;
		padding-top: 10upx;
	}

	.model {
			display:flex;
			flex-direction: column;
			flex-wrap: nowrap;
			justify-content: flex-end;
			width: 750upx;
			height: 520upx;
			position: absolute;
			background-color: rgba($color: #364161, $alpha: 0.2);
			z-index: 1;
			top: 0;
			left: 0;
			
			.mtitle {
				margin-top: 20upx;
				width: 700upx;
				margin-left: 25upx;
				font-size: 44upx;
				color: #fff;
				line-height: 64upx;
			}
		
			.info-user {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: flex-start;
				align-items: center;
				align-content: center;
				margin-top: 30upx;
				margin-left: 5upx;
				margin-bottom: 30upx;
	
				.info {
					display: flex;
					flex-direction: column;
					flex-wrap: wrap;
					justify-content: flex-end;
					align-items: left;
					margin-left: 20upx;
					font-size: 24upx;
					font-weight: bolder;
					color: #fff;
				}
			}
		}
	
	
		.info-content {
			width: 680upx;
			text-align: left;
			margin-top: 40upx;
			// #ifdef MP-WEIXIN
			margin-left: 35upx;
			// #endif
			// #ifndef MP-WEIXIN
			margin-left: 35upx;
			// #endif
		}
	
		.info-header {
			margin-top: 10upx;
			margin-left: 25upx;
			padding-bottom: 20upx;
			color: #999;
			font-size: 22upx;
	
			.send {
				margin-right: 20upx;
			}
		}
	
		.line {
			height: 30upx;
			width: 750upx;
			background-color: #f3f3f3;
		}
</style>
