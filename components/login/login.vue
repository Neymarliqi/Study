<template>
	<view class="login" :class="{show:show}">
		<view class="mask" @tap="closeLogin" bind:tap="cancel" catch:touchmove="emptyHandler"></view>
		
		<view class="container">
			<view class="close-box" @tap="closeLogin" bind:tap="cancel">
				<image class="close-img" src="/static/close.png" />
			</view>
			
			<u-form :model="form" ref="uForm">
				<u-form-item label="账号" prop="login" label-width="150" required>
					<u-input v-model="form.login" placeholder='输入手机号/邮箱/昵称' />
				</u-form-item>

				<u-form-item label="密码" label-width="150" required prop="password">
					<u-input v-model="form.password" type="password" placeholder='限4-20个字符,区分大小写' />
				</u-form-item>
	
				<view class="btns">
					<u-button class="ubtn" @click="submit">提交</u-button>
					<u-button class="ubtn" @click="handlercancle" >取消</u-button>
				</view>
			</u-form>


			<view class="serve-info">点击登录/注册前端论坛，即表示已阅读并同意</view>
			<view class="serve-text">
				<view @tap="gotoWeb('https://uniapp.dcloud.io/component/mp-weixin-plugin')">《隐私政策》</view>
				<view @tap="gotoWeb('https://developers.weixin.qq.com/miniprogram/dev/framework/')">《用户协议》</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'

	export default {
		data() {
			return {
				// 登陆组件是否显示
				show: true,
				
				// 登陆方式
				loginType: 'pwlogin',
				
				
				// 用户信息输入框
				form: {
					login: '',
					password: ''
				},
				
				// 用户输入规则校验
				rules: {
					// 密码登陆账号校验，该输入可以是：手机号、邮箱、昵称
					login: [{
						validator: (rule, value, callback) => {
							// 只有在 密码登陆 的情况下才需要进行前端规则校验
							if (this.loginType === 'pwlogin') {
								return !this.$u.test.isEmpty(value)
							} else {
								return true
							}
						},
						message: '必填 * 输入内容不许为空',
						trigger: ['change', 'blur'],
					}],
					
					// 输入密码验证
					password: [{
						validator: (rule, value, callback) => {
							// 除了 手机验证码登陆 其他均需要验证
							if (this.loginType !== 'codelogin') {
								// 名字长度为 2-10 位
								return (value.length>=4 && value.length<=20)
							} else {
								return true
							}
						},
						message: '必填  * 请输入 4-20 位密码',
						trigger: ['change', 'blur'],
					}],
				}
			}
		},
		
		computed: {
			...mapState(['loginState', 'userInfo'])
		},
		
		// 必须要在onReady生命周期设置校验规则，因为onLoad生命周期组件可能尚未创建完毕
		// 组件里面使用mounted，onReady是页面级别的
		mounted() {
			this.$refs.uForm.setRules(this.rules);
		},
		
		async created() {
		
			// this.$refs.uForm.setRules(this.rules);
			// 每次这个组件展开，我们就去判断一下当前 token 是否可以获取新的 token 如果可以获取，咱们就关闭登陆状态
			// 会出现报错，这个没关系
			let res = await this.$u.api.getUserMsg();
			
			// 点赞消息数量
			if (res.statusCode === 200) {
				this.show = false
				return
			} else {
				this.show = true
			}
		},
		
		methods: {
			...mapActions(['userLoginAction', 'userLogoutAction']),
			
			// 关闭弹窗
			closeLogin() {
				this.show = false
			},
			// 关闭弹窗，并且清空表单
			handlercancle(){
				this.show = false
				this.form = {
					login: '',
					password: ''
				}
			},
			
			// 打开登陆弹窗
			openLogin() {
				this.show = true
			},
			
			// 跳转到 H5 页面
			gotoWeb(url) {
				wx.navigateTo({
					url: '/pages/webview/webview?url=' + encodeURI(url)
				});
			},
			
			// 取消表单输入
			cancel() {
				this.form = {
					login: '',
					password: ''
				}
			},
			
			// 提交表单验证
			submit() {
				this.$refs.uForm.validate(async valid => {
							if (!valid) {
									uni.showToast({
										title: '请检查输入',
										icon: 'loading'
									})
									return false
					       }else{
								let resa = await this.$u.api.userLogin({
									login: this.form.login,
									// login: "贺鹏程",
									password: this.form.password,
									// password:"8888",
								}).catch(res => {
									// 返回来的错误数据，也需要拿着，用catch的方法
									// 用.then是不行的，然后返回错误信息
									return res;
				                  
								})
								// console.log(resa)
								
						
								if (!!resa.access_token) {
									// 登陆成功
									this.loginAfter(resa.access_token)
								} else {
									// 如何把这个组件放在最上面
									// 我是把登录这个组件设置 z-index:9999
									uni.showModal({
										title: '登录失败',
										content: resa.data.message
									})
								}
					       }
				});
			},
			
			// 注册、登陆成功后设置相关逻辑
			// 这里经常出现userInfo没有定义，原因是store的index没有写好，写好后没问题
			async loginAfter(token) {
				this.show = false
				uni.setStorageSync('token', token)

				// 获取未读消息提示
				let res = await this.$u.api.getUserMsg()
				// console.log(res)
	
				let loginInfo = {
					name:"贺鹏程",
					avatar:'/static/nopic.png',
					liked:res.user.liked,
					commented: res.user.commented
				};
				
				this.userLoginAction(loginInfo)
				// console.log("调用成功")
				uni.$emit('meUserLogin')
				uni.$emit('indexUserLogin')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: flex-end;
		opacity: 0;
		transition: opacity 300, z-index 0 300;
		pointer-events: none;
		z-index: 999;

		&.show {
			z-index: 999;
			opacity: 1;
			pointer-events: auto;
		}

		.mask {
			position: fixed;
			width: 100%;
			height: 100%;
			background-color: rgba($color: #000000, $alpha: 0.3);
		}

		.container {
			z-index: 999;
			display: flex;
			flex-direction: column;
			width: 100%;
			padding: 40upx 20upx;
			background-color: #f1f1f1;
			border-radius: 20upx;
			align-items: center;
			position: relative;

			.p-name {
				margin-top: 48upx;
				font-size: 36upx;
				font-weight: normal;
			}

			.close-box {
				position: absolute;
				right: 32upx;
				top: 38upx;
				width: 56.56upx;
				height: 56.56upx;
				padding: 10upx;

				.close-img {
					width: 100%;
					height: 100%;
				}
			}
		}

		.header {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 28upx;

			.logo-wrap {
				width: 144upx;
				height: 144upx;
				overflow: hidden;
				border-radius: 20upx;
			}

			.logo {
				width: 100%;
				height: 100%;
			}
		}

		.info {
			color: #333;
		}

		.submit-btn {
			width: 642upx;
			height: 88upx;
			margin-top: 60upx;
			margin-bottom: 60upx;
			border-radius: 44upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			color: #fff;
			background-color: #0046f5;
			font-size: 36upx;

			.wechat-img {
				width: 44upx;
				height: 34upx;
				margin: 0 18upx;
			}
		}

		.phone-login {
			color: #0046f5;
			font-size: 28upx;
			margin-top: 40upx;
			border: none;
			background-color: #f1f1f1;
		}

		.cancel-btn {
			width: 100%;
			margin-top: 60upx;
			color: #333;
			background-color: #f1f1f1;
		}

		.serve-info {
			font-size: 22upx;
			margin-top: 20upx;
		}

		.serve-text {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			font-size: 22upx;
			color: #6079b8;
			margin-top: 10upx;
		}
	}

	button::after {
		border: none;
	}

	.btns {
		margin-top: 20upx;
		text-align: center;

		.ubtn {
			display: inline-block;
			margin: 0 20upx;
		}
	}

	.type {
		margin-top: 80upx;
	}
</style>
