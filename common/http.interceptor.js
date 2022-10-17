// common/http.interceptor.js

// http://ts.lagou.uieee.com/api/v2
// 这里的vm，就是我们在vue文件里面的this，所以我们能在这里获取vuex的变量，比如存放在里面的token变量
const install = (Vue, vm) => {
	// 此为自定义配置参数，具体参数见上方说明
	Vue.prototype.$u.http.setConfig({
		baseUrl: 'http://ts.lagou.uieee.com/api/v2',
		loadingText: '努力加载中~',
		loadingTime: 800,
		// ......
	});

	// 请求拦截，配置Token等参数
	Vue.prototype.$u.http.interceptor.request = (config) => {
		// 引用token
		// 方式一，存放在vuex的token，假设使用了uView封装的vuex方式
		// 见：https://uviewui.com/components/globalVariable.html
		// config.header.token = vm.token;

		// 方式二，如果没有使用uView封装的vuex方法，那么需要使用$store.state获取
		// config.header.token = vm.$store.state.token;

		// 方式三，如果token放在了globalData，通过getApp().globalData获取
		// config.header.token = getApp().globalData.username;

		// 方式四，如果token放在了Storage本地存储中，拦截是每次请求都执行的
		// 所以哪怕您重新登录修改了Storage，下一次的请求将会是最新值
		const token = uni.getStorageSync("token");
		config.header.Authorization = 'Bearer' + token;
		config.header.Accept = "application/json";
		// const token = uni.getStorageSync('token');
		// config.header.token = token;
		// config.header.Token = 'xxxxxx';

		// 可以对某个url进行特别处理，此url参数为this.$u.get(url)中的url值
		// if(config.url == '/user/login') config.header.noToken = true;
		// 最后需要将config进行return
		return config;

	}

	// 响应拦截，判断状态码是否通过
	Vue.prototype.$u.http.interceptor.response = (res) => {
	   if (res.code == 401) {
	   			// 如果返回false，则会调用Promise的reject回调，
	   			// 并将进入this.$u.post(url).then().catch(res=>{})的catch回调中，res为服务端的返回值
	   			vm.$u.toast("当前接口访问失败");
	   			return false;
	   		} else {
	   			// res为服务端返回值，可能有code，result等字段
	   			// 这里对res.result进行返回，将会在this.$u.post(url).then(res => {})的then回调中的res的到
	   			// 如果配置了originalData为true，请留意这里的返回值
	   			return res;
	   		}
	}
}

export default {
	install
}
