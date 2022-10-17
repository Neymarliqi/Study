let todoLoveMixin ={
	methods:{
		
		// 点赞或者取消点赞，Mixins因为是混入Vue 的方式，可以不用引用
		async clickLove(item){
			// 先判断是否登录
			if(!this.loginState){
				this.refs.login.openLogin()
				return
			}
			
			// 动态点赞或者取消点赞的操作
			if(item.has_like){
				--item.like_count;
				item.has_like=false;
				await this.$u.api.unlikeThisFeed({
					id:item.id,
				}).catch(res => {
					// 返回来的错误数据，也需要拿着，用catch的方法
					// 用.then是不行的，然后返回错误信息
					console.log("取消点赞错误数据",res)
					return res;
			       
				});
				uni.showToast({
					title:'取消点赞',
					icon:'success',
					duration:1000,
				});
			}else{
				++ item.like_count;
				item.has_like = true;
				await this.$u.api.likeThisFeed({
					id:item.id,
				}).catch(res => {
					// 返回来的错误数据，也需要拿着，用catch的方法
					// 用.then是不行的，然后返回错误信息
					console.log("点赞错误数据",res)
					return res;         
				});
				uni.showToast({
					title:'点赞成功',
					icon:'success',
					duration:1000,
				});
			}
			
			uni.$emit('indexFeedLoveChange',item)
			uni.$emit('myFeedLoveChange',item)
		}
		
	}
}

export default todoLoveMixin