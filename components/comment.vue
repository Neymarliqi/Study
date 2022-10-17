<template>
	<view>
		<!-- 评论列表 -->
		<view class="comments">
			<view class="title gohere" id="gohere" ref="gohere">最新评论</view>
			<view class="no-comment" v-if="commintsList.length == 0">暂无评论</view>
			<view v-for="(commentItem, index) in commintsList" :key="index" class="one-comment">
				<!-- 一级评论相关 -->
				<view class="commenter">
					<view class="info">
						<view class="left">
							<u-avatar size="50" class="avatar"
								:src="!!commentItem.user.avatar ? commentItem.user.avatar.url : '' " />
							<view class="name">{{ commentItem.user.name }}</view>
						</view>
					</view>
					<view class="content">{{ commentItem.body }}</view>
					<view class="uptime">{{ commentItem.created_at | formatterTime2}} 评论</view>
				</view>
			</view>
			<view class="onthebuttom" v-show="show">
				<text>我是有底线的啦～</text>
			</view>
		</view>

		<!-- 底部信息 -->
		<view class="tab-bar">
			<view class="minput" @tap="openComment">说点什么···</view>
			<view class="mview">
				<!-- 点赞相关统计 -->
				<view class="mbtn" @tap="sendLove">
					<image class="micon" v-if="type=='info'"
						:src=" oneInfoClone.has_like ? '/static/lover.png' : '/static/love.png' " mode="aspectFit" />
					<!-- 之前不显示：是写成oneInfoClone.like_count，但实际上是oneInfoClone.digg_count，digg_count-->
					<text class="mtext"
						v-if="type=='info' && oneInfoClone.digg_count>0 ">{{ oneInfoClone.digg_count }}</text>
					<text class="mtext" v-if="type=='info' && oneInfoClone.digg_count<=0 ">点赞</text>


					<image class="micon" v-if="type=='feed'"
						:src=" oneInfoClone.has_like ? '/static/lover.png' : '/static/love.png' " mode="aspectFit" />
					<text class="mtext"
						v-if="type=='feed' && oneInfoClone.like_count>0 ">{{ oneInfoClone.like_count }}</text>
					<text class="mtext" v-if="type=='feed' && oneInfoClone.like_count<=0 ">点赞</text>
				</view>

				<!-- 评论相关统计 -->
				<view class="mbtn" @tap="gotoComment">
					<image class="micon" src="/static/msg.png" mode="aspectFit" />
					<text class="mtext"
						v-if="type=='info' && oneInfoClone.comment_count>0 ">{{ oneInfoClone.comment_count }}</text>
					<text class="mtext" v-if="type=='info' && oneInfoClone.comment_count<=0 ">评论</text>

					<text class="mtext"
						v-if="type=='feed' && oneInfoClone.feed_comment_count>0 ">{{ oneInfoClone.feed_comment_count }}</text>
					<text class="mtext" v-if="type=='feed' && oneInfoClone.feed_comment_count<=0 ">评论</text>
				</view>

				<!-- 转发次数统计 -->
				<!-- #ifdef MP-WEIXIN
				<button class="mbtn mhare" open-type="share">
					<image class="micon" src="/static/wx.png" mode="aspectFit" />
					<text class="mtext">分享</text>
				</button>
				#endif -->

			</view>
		</view>

		<!-- 发布评论 -->
		<view class="commentBox" v-if="showCommentBox">
			<view class="header">
				<text class="title">发表评论</text>
				<u-icon class="icon" name="arrow-down-fill" color="#999" size="28" @tap="closeComment" />
			</view>
			<textarea class="texta" placeholder-style="color:#888" placeholder="想说点什么..." cursor-spacing="150"
				:focus="true" :fixed="true" :value="cinput" @input="getInput" />
			<view class="btns">
				<button class="mini-btn" type="primary" size="mini" @tap="sendComment"
					:disabled="disableSendCommentTag">发布</button>
				<button class="mini-btn" type="default" size="mini" @tap="closeComment">取消</button>
			</view>
		</view>

		<!-- 登陆组件 -->
		<login ref="login" v-if="!loginState" />

	</view>
</template>

<script>
	import {
		formatterDate
	} from "@/utils/dateUtil.js"
	// import timeFrom from "@/tools/timeFrom.js";
	import todoLoveMinxin from '@/mixins/todoFeed.js'
	import {
		mapState
	} from 'vuex'

	export default {
		mixins: [todoLoveMinxin],
		props: {
			oneInfo: Object,
			type: String
		},
		// inject:["reload"],
		data() {
			return {
				// 当前动态评论列表详情
				commintsList: [],
				// props 传递的数据无法改变触发 DOM 更新
				oneInfoClone: {},
				// 是否展开评论弹窗
				showCommentBox: false,
				// 评论输入内容
				cinput: '',
				// 是否可以发送评论
				disableSendCommentTag: true,
				
				afterId:undefined,
				
				show:false
			};
		},
		computed: {
			...mapState(['loginState', 'userInfo'])
		},
	
		created() {

			// props已经拿到这个数据，放在created前面进行太早了,
			// 父组件我用了个条件语句让页面先加载在创建组件
			this.oneInfoClone = this.oneInfo
			// console.log("先看下这个数据",this.oneInfoClone)
			this.getCommentsList();
		},

		// watch:{
		// 	oneInfo(newVal, oldVal){
		// 		console.log('数据触发了更新：')
		// 		console.log(newVal)
		// 	}
		// },
		methods: {
			// 获取评论列表
			async getCommentsList() {
				
				if (this.type === "feed") {
					// 获取当前动态评论列表信息
					// console.log(this.oneInfo)
					let res = await this.$u.api.getFeedComments({
						id: this.oneInfo.id,
						after: this.afterId
					});
					console.log("这是瀑布流",res)
					// 原来的写法是res.data.comments，现在的写法是res.comments，打印数据之后发现的
					// this.commintsList = res.comments;
				
					this.commintsList.push(...res.comments);
					this.afterId = this.commintsList[this.commintsList.length - 1].id;
					// console.log("复值给瀑布流commintsList的数据",this.commintsList)
					
					if(res.comments.length==0){
							this.show=true
					}    
					
				} else {
					// 获取当前资讯评论列表信息
					// 请求的时候，带上id与 列表最后的ID
					let res = await this.$u.api.getNewComments({
						id: this.oneInfo.id,
						after: this.afterId
					});

					 console.log("这是资讯",res)
					
					  // 默认把列表在从commintsList形成新的数组
					  this.commintsList.push(...res.comments);
					  // 这个时候吧afterID加上
					  this.afterId = this.commintsList[this.commintsList.length - 1].id;
					  // console.log("复值给资讯commintsList的数据",this.commintsList)
				     // 原来的写法是res.data.comments，现在的写法是res.comments，打印数据之后发现的
					 if(res.comments.length==0){
						 this.show=true
					 }    
				}
			},

			// 详情内的 评论部分的 点赞逻辑操作
			async sendLove() {
				// 判断当前登录状态
				if (!this.loginState) {
					this.$refs.login.openLogin()
					return
				}

				// 瀑布流动态是混入方式
				if (this.type === "feed") {
					this.clickLove(this.oneInfoClone)
				} else {
					// 新闻资讯的动态点赞，这个完全可以放在 minxns里面，其实也可以抽象出来的
					if (this.oneInfoClone.has_like) {

						this.oneInfoClone.has_like = false;
						await this.$u.api.unlikeThisNew({
							id: this.oneInfoClone.id,
						}).catch(res => {
							// 返回来的错误数据，也需要拿着，用catch的方法
							// 用.then是不行的，然后返回错误信息
							// console.log("取消点赞错误数据",res)
							return res;
						});
						--this.oneInfoClone.digg_count;
						uni.showToast({
							title: "取消点赞",
							icon: "success",
							duration: 1000,
						});

					} else {
						++this.oneInfoClone.digg_count;
						this.oneInfoClone.has_like = true;
						await this.$u.api.likeThisNew({
							id: this.oneInfoClone.id,
						}).catch(res => {
							// 返回来的错误数据，也需要拿着，用catch的方法
							// 用.then是不行的，然后返回错误信息
							// console.log("点赞错误数据",res)
							return res;

						});
						uni.showToast({
							title: "点赞成功",
							icon: "success",
							duration: 1000,
						});
					}
				}
			},

			// 跳转到评论列表
			gotoComment() {
				const query = uni.createSelectorQuery().in(this);
				query.select('#gohere').boundingClientRect(data => {
					uni.pageScrollTo({
						duration: 100,
						scrollTop: data.top
					})
				}).exec();
			},

			// 打开评论弹窗
			openComment() {
				this.showCommentBox = true
			},
			closeComment() {
				this.showCommentBox = false
			},
			// 获取输入内容
			getInput(e) {
				this.cinput = e.detail.value;
				if (!this.cinput) {
					this.disableSendCommentTag = true
				} else {
					this.disableSendCommentTag = false
				}
			},

			// 发送评论信息
			async sendComment() {
				// 发送状态判定
				if (this.disableSendCommentTag) return
				this.disableSendCommentTag = true


				if (this.type === 'feed') {
					await this.$u.api.commentOneFeed({
						id: this.oneInfoClone.id,
						body: this.cinput
					}).catch(res => {
						console.log('这是瀑布流返回信息',res)
						return res;
					});
					
					// this.afterId = null
					// 这里是是怎样加入到数据库了？？ 很奇怪，数据库做的自增长么？
					++this.oneInfoClone.feed_comment_count
					// 通知 个人中心当前动态评论增加
					uni.$emit('myFeedCommentChange', this.oneInfoClone)
				
				
				} else {
					await this.$u.api.commentOneInfo({
						id: this.oneInfoClone.id,
						body: this.cinput
					}).catch(res => {
						console.log('这是资讯流返回信息',res)
						return res;
					});
					// this.afterId = null
					++this.oneInfoClone.comment_count
					
				}

				uni.showToast({
					title: "评论成功",
					icon: "success",
					duration: 1000,
				});
				this.cinput = ''
				this.closeComment()
				this.getCommentsList()
			}
		},

		// 过滤器
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
	};
</script>

<style lang="scss" scoped>
	.comments {
		padding: 20upx 20upx 200upx;

		.title {
			font-weight: bolder;
			font-size: 32upx;
			margin-bottom: 40upx;
		}

		.no-comment {
			text-align: center;
			margin: 120upx 0 280upx;
			color: #666;
		}

		.one-comment {
			&.last-comment {
				border-bottom: none;
			}

			.commenter {
				.info {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: space-between;
					align-items: center;
					align-content: center;
					margin-top: 20upx;

					.left {
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						justify-content: flex-start;
						align-items: center;
						align-content: center;

						.avatar {
							margin-right: 20upx;
							margin-top: 10upx;
						}

						.name {
							font-size: 24upx;
							font-weight: bolder;
							color: #1f2046;
						}
					}
				}

				.content {
					color: #666;
					font-size: 30upx;
					line-height: 50upx;
					margin-left: 70upx;
					margin-top: 10upx;
					padding-right: 20upx;
				}

				.uptime {
					color: #999;
					font-size: 20upx;
					margin-left: 70upx;
					margin-top: 10upx;
					padding-bottom: 20upx;
					border-bottom: 1upx solid #f2f2f2;
				}
			}
		}
		.onthebuttom{
			font-size: 20upx;
			margin-bottom: 40upx;
			text-align: center;
		}
	}

	.tab-bar {
		position: fixed;
		width: 750upx;
		height: 120upx;
		left: 0;
		bottom: 0;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		align-content: center;
		color: #ccc;
		border-top: 1upx solid #f6f6f6;
		background-color: #fff;

		.minput {
			background-color: #eee;
			height: 60upx;
			// #ifdef MP-WEIXIN
			width: 300upx;
			// #endif
			// #ifndef MP-WEIXIN
			width: 440upx;
			// #endif
			border-radius: 30upx;
			padding-left: 30upx;
			margin-left: 20upx;
			line-height: 60upx;
			color: #AAAAAA;
			font-size: 22upx;
		}

		.mview {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-around;
			align-items: center;
			align-content: center;
			color: #ccc;
			margin-right: 25upx;

			.mbtn {
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: center;
				align-items: center;
				align-content: center;
				width: 120upx;
				background-color: #fff;

				&.mhare {
					width: 150upx;
				}
			}

			.mbtn::after {
				border: none;
				background-color: none;
			}

			.micon {
				width: 36upx;
				height: 36upx;
			}

			.mtext {
				color: #001432;
				font-size: 24upx;
				margin-left: 10upx;
			}
		}


	}

	.commentBox {
		position: fixed;
		width: 750upx;
		height: 250px;
		left: 0;
		bottom: 0;
		border-top: 1upx solid #eee;
		background-color: #fafafa;

		.header {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			align-content: center;
			padding: 20upx 15px 20upx 25px;

			.title {
				color: #999;
				font-size: 28upx;
				font-weight: bold;
			}

			.icon {
				padding: 20upx;
			}
		}

		.texta {
			width: 600upx;
			height: 100px;
			margin-left: 50upx;
			padding: 10px 25upx;
			border: 1upx solid #ddd;
			border-radius: 10upx;
			background: #fff;
			font-size: 28upx;
		}

		.btns {
			width: 650upx;
			margin-left: 50upx;
			margin-top: 15px;
			text-align: right;

			.mini-btn {
				margin-left: 40upx;
			}
		}
	}
</style>
