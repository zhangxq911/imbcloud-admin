import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setToken, getToken, canTurnTo, setTitle } from '@/libs/util'
import config from '@/config'
import { getAccount } from '../api/user';
import Cookies from 'js-cookie'
const { homeName } = config

Vue.use(Router)
const router = new Router({
  routes,
  // base: '/console/',
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

const getQueryVariable = variable => {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] == variable) { return pair[1]; }
  }
  return (false);
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    if (to.path !== '/h5/share/channel' && to.path !== '/access/h5/share/channel') {
      next({
        name: LOGIN_PAGE_NAME // 跳转到登录页
      })
    }
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页

    // 获取url地址，如果有账号和密码则进行跳转主页
    const userName = getQueryVariable('name')
    const password = getQueryVariable('psw')
    if (userName && password) {
      store.dispatch('handleLogin', { userName, password }).then(res => {
        if (res.data.result == true) {
          next({
            name: homeName // 跳转到homeName页
          })
        } else {
          next() // 跳转
        }
      })
    } else {
      next() // 跳转
    }
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else if (token && !to.name) {
    // 已登录且要跳转的是默认域名
    getAccount(token).then(res => {
      if (res.data.result) {
        store.commit('setAccountName', res.data.msg.accountName)
        store.commit('setAccountId', res.data.msg.accountId)
        if (res.data.msg.type === 'admin') {
          store.commit('setAccess', ['admin', 'unit'])
        } else if (res.data.msg.type === 'unit') {
          store.commit('setAccess', ['unit'])
        }
        next({
          name: homeName // 跳转到homeName页
        })
      } else {
        setToken('')
        next({
          name: LOGIN_PAGE_NAME // 跳转到homeName页
        })
      }
    })
  } else {
    if (!store.state.user.hasGetInfo) {
      turnTo(to, store.state.user.access, next)
    } else {
      store.dispatch('getUserInfo').then(user => {
        // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
        turnTo(to, user.access, next)
      }).catch(() => {
        setToken('')
        next({
          name: 'login'
        })
      })
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
