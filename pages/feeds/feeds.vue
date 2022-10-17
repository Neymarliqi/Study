<template>
	<view class="rfeeds">
		<view class="one-feeds-box" v-for="(feedsListex,i) in showFeedslist" :key="i">
			<view class="one-feed" v-for="(item,index) in feedsListex" :key="index"  :class="index % 6 == 0 ? ( i%2==0 ? 'feed-big-left' :'feed-big-right' ) : '' ">
				<navigator :url="'/subpages/feedinfo?id='+ item.id " >
					<image :src="item.cover" class="feed-content" mode="aspectFill" :lazy-load="true" />
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 动态列表数据
				feedsList:[],
				showFeedslist:[],
				afterId:null
			}
		},
		onPullDownRefresh() {
			this.feedsList=[];
			this.showFeedslist=[];
			this.geFeeds()
		},
		onReachBottom() {
			this.geFeeds()
		},
		onLoad() {
			this.geFeeds()
		},
		methods: {
			async geFeeds(){
				let res= await this.$u.api.getFeeds({
					 after: this.afterId
				})
				// console.log("原始数据",res)
				let feeds = res.feeds.map(item =>{		
					return{
						// 获取封面,有些 images没有 ，所以判断这个的长度
						cover:item.images.length? this.BaseFileURl +item.images[0].file:'/static/noCover.png',
					
						// 获取id
						id:item.id
					}
				})
				
				this.feedsList.push(...feeds);
				this.afterId=this.feedsList[this.feedsList.length - 1].id;
				
				
				// console.log("这是新闻列表",this.feedsList)
				let showArrList =[]
				for(let i=0; i<this.feedsList.length;i++){
					if(i%6 ===0 &&!!this.feedsList[i+5]){
						showArrList.push(this.feedsList.slice(i,i+6))
					}
				}
				this.showFeedslist=showArrList
				// console.log("这是循环的数据",this.showFeedslist)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.rfeeds {
		background-color: #FFFFFF;
		padding-bottom: 20upx;

		.one-feeds-box {
			width: 704upx;
			margin: 4upx 22upx 0 22upx;
			// 定义栅格布局
			display: grid;
			// 定义栅格每一列的宽度
			grid-template-columns: 232upx 232upx 232upx;
			// 定义栅格每一行的高度
			grid-template-rows: 232upx 232upx 232upx;
			// grid-row-gap属性设置行与行的间隔（行间距），grid-column-gap属性设置列与列的间隔（列间距）
			grid-row-gap: 4upx;
			grid-column-gap: 4upx;
			background-color: #DADADA;

			.one-feed {
				position: relative;

				.feed-content {
					width: 232upx;
					height: 232upx;
					border: 1px solid #EEEEEE;
					border-radius: 4upx;
				}

				.icon {
					position: absolute;
					right: 10upx;
					top: 10upx;

					.play-icon {
						width: 40upx;
						height: 40upx;
					}
				}

				&.feed-big-left {
					grid-column-start: 1;
					grid-column-end: 3;
					grid-row-start: 1;
					grid-row-end: 3;
					background-color: #DADADA;

					.feed-content {
						width: 466upx;
						height: 466upx;
						border: 1px solid #EEEEEE;
					}
				}

				&.feed-big-right {
					grid-column-start: 2;
					grid-column-end: 4;
					grid-row-start: 1;
					grid-row-end: 3;
					background-color: #DADADA;

					.feed-content {
						width: 466upx;
						height: 466upx;
						border: 1px solid #EEEEEE;
					}
				}
			}
		}
	}

</style>