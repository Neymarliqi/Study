<template>
	<view v-if="getRequestOk">
	<!-- <view v-if="getRequestOK"> -->
		<view class="feed-user">
			<u-avatar size="60" class="avatar" :src=" feedInfo.avatar" />
			<view class="info">
				<text>{{ feedInfo.name }}</text>
			</view>
		</view>
		<view class="feed-info">
			<view class="title" v-if="!!feedInfo.feed_content">{{ feedInfo.feed_content }}</view>
			<image class="feed-imgs" mode="widthFix" v-for="(image, index) in feedInfo.images" :key="index" :src="image" @tap="previewImage(index)" />
			<view class="other">
				<text>{{ feedInfo.created_at | formatterTime2 }} 发布</text>
				<text>{{ feedInfo.feed_view_count }} 阅读 {{ feedInfo.like_count }} 点赞</text>
			</view>
		</view>
		<view class="line" />
		<comment :oneInfo="feedInfo"  type="feed" v-if="commentshow" ref="comment"/>
	</view>
</template>

<script>
	// 评论插件
	import comment from '@/components/comment.vue'
	// 引入时间处理的文件
	import {formatterDate} from "@/utils/dateUtil.js"
	export default{
		data(){
			return{
				feedInfo:{},
				getRequestOk:true,
				commentshow:false,
			}
		},
		components:{ 
			comment 
		},
		onReachBottom(){
			// 这个是到底部，父组件调用子组件里面的方法，这是其中一种形式
			// 组件中 写好ref= “名字”，然后 this.$refs.名字.子组件的方法
			this.$refs.comment.getCommentsList()
		},
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
		async onLoad(params){
			// console.log('展示',params)
			let res =  await this.$u.api.getFeedInfo(params).catch(res => {
				// 返回来的错误数据，也需要拿着，用catch的方法
				// 用.then是不行的，然后返回错误信息
				return res;
				                  
			})
			if(res){
				this.commentshow=true
			}
			// console.log('展示结果',res)
			// map需要是数组才能拼接
			let images=res.images.map(one=>{
				return this.BaseFileURl + one.file
			})
			
			this.feedInfo={
				...res,
				name:res.user.name,
				avatar:!!res.user.avatar?res.user.avatar.url:'/static/nopic.png',
				images
			}
			
			// console.log('展示结果',this.feedInfo)
			// this.feedInfo = res.map(res =>{
			// 			return{
			// 				...res,
			// 				name:res.user.name,
			// 				avatar:!!res.user.avatar?res.user.avatar:'/static/wechat.png' ,
			// 				imagess
			// 			}
			// })
	
			
			
			// console.log('展示结果处理后的结果',this.feedInfo)
		},
		methods: {
		    
		}	
		
		
	}
	
	
	
</script>

<style lang="scss" scoped>
	.feed-user {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
		align-content: center;
		margin: 20upx 0 0 25upx;

		.info {
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
			justify-content: flex-end;
			align-items: left;
			margin-left: 20upx;
			font-size: 24upx;
			font-weight: bolder;
			color: #1f2046;
		}
	}

	.feed-info {
		width: 700upx;
		margin-top: 20upx;
		margin-left: 25upx;
		text-align: center;
		padding-bottom: 10upx;

		.title {
			font-size: 32upx;
			margin-bottom: 30upx;
			text-align: left;
			line-height: 52upx;
			color: #666;
		}

		.feed-imgs {
			margin: 5upx 0;
			width: 100%;
		}

		.other {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			align-content: center;
			padding: 40upx 0 20upx;
			font-size: 24upx;
			color: #888;

			.micon {
				padding: 10upx 20upx;
			}
		}
	}

	.line {
		height: 30upx;
		width: 750upx;
		background-color: #f3f3f3;
	}
</style>
