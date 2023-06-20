import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../components/Home.vue'
import AddLog from '../views/AddLog.vue'
import AddUser from '../views/AddUser.vue'
import AnalysisLog from '../views/AnalysisLog.vue'
import SearchUser from '../views/SearchUser.vue'



Vue.use(VueRouter)

// 重写push|replace方法
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace
VueRouter.prototype.push = function (location, resolve, reject) {
  // 此函数上下文(this指向)为VueRouter的一个实例
  if (resolve && reject) {    //如果我们自己指定了成功/失败的回调，则自己传入
    originPush.call(this, location, resolve, reject)
    //若此时直接使用originPush()，相当于调用了函数originPush()，则函数内的this指向window（内部代码将无法执行）。故应用call或apply方法修改this指向
  } else {    //如果我们没有指定成功/失败的回调，则自动帮我们生成，防止报错
    originPush.call(this, location, () => { }, () => { })
  }
}
// replace方法同理
VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject)
  } else {
    originReplace.call(this, location, () => { }, () => { })
  }
}

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: '首页',
    component: Home,
    children: [
      {
        path: '/addlog',
        name: '添加日志',
        component: AddLog,
        meta:{
          icon:'el-icon-info'
        }
      },
      {
        path: '/adduser',
        name: '添加用户',
        component: AddUser,
        meta:{
          icon:'el-icon-user'
        }
      },
      {
        path: '/analysislog',
        name: '分析日志',
        component: AnalysisLog,
        meta: {
          icon:'el-icon-s-opportunity'
        }
      },
      {
        path: '/searchuser',
        name: '查询用户',
        component: SearchUser,
        meta:{
          icon:'el-icon-search'
        }
      }
    ]
  },
  {
    path: '/login',
    name: '登录',
    component: Login
  },
]


const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  let userInfo = window.sessionStorage.getItem('userInfo')
  if (userInfo) {
    if (to.path == '/login') {
      next('/home')
    } else {
      next()
    }
  } else {
    if (to.path != '/login') {
      next('/login')
    } else {
      next()
    }
  }
})

export default router
