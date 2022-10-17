import Vue from 'vue'
import App from './App'


Vue.config.productionTip = false


// 全局使用，js引入uView插件
import uView from 'uview-ui';
Vue.use(uView);


// 全局额设置文件基础访问信息“网站的链接”,挂载原型链上
Vue.prototype.BaseFileURl = "http://ts.lagou.uieee.com/api/v2/files/"

// 导航条：.vue后缀全局组件组册，全局可以使用
import navBar from "@/uni_modules/zhouWei-navBar/components/zhouWei-navBar/zhouWei-navBar.vue";
Vue.component('nav-bar',navBar)

// 登录组件 注册成全局组件，可以直接使用
import login from "@/components/login/login.vue";
Vue.component('login',login)

// UGC上传 注册成全局组件，可以直接使用
import gotoShare from "@/components/gotoShare.vue";
Vue.component('gotoShare',gotoShare)

// 引入store讲内存挂载到原型上，全局使用，创建实例的时候全局使用
import store from '@/store/index.js'
Vue.prototype.$store = store

// 其实是跟小程序进行区分的
App.mpType = 'app'

// 创建Vue实例
const app = new Vue({
    ...App,store
})

console.log(app)
// http拦截器，此为需要加入的内容，如果不是写在common目录，请自行修改引入路径
import httpInterceptor from '@/common/http.interceptor.js'
// Js这里需要写在最后，是为了等Vue创建对象完成，引入"app"对象(也即页面的"this"实例)，是不是跟Vue.prototype.$store =store写法一样？？？
Vue.use(httpInterceptor, app)

// js全局使用http接口API集中管理引入部分
import httpApi from '@/common/http.api.js'
Vue.use(httpApi, app)

// 挂载App容器里面
app.$mount()
